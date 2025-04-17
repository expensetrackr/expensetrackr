<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Data\Synth\SynthEnrichData;
use App\Models\Merchant;
use App\Models\Transaction;
use App\Services\SynthService;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Spatie\PrefixedIds\PrefixedIds;

final class EnrichTransactionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 3;

    public function __construct(
        private readonly Transaction $transaction
    ) {}

    public function handle(SynthService $synth): void
    {
        try {
            if (! $this->transaction->workspace->settings?->is_data_enrichment_enabled) {
                Log::info('Data enrichment is disabled for workspace', [
                    'workspace_id' => $this->transaction->workspace->id,
                    'transaction_id' => $this->transaction->id,
                ]);

                return;
            }

            $description = "{$this->transaction->name} - {$this->transaction->note}";

            $existingMerchant = $this->findBestMatchingMerchant();

            if ($existingMerchant instanceof Merchant) {
                $this->attachMerchantToTransaction($existingMerchant);

                return;
            }

            // If no existing enrichment found, fetch from SynthService
            $enrichmentData = $synth->enrichTransaction($description, $this->transaction->category->name ?? '');

            if (! $enrichmentData instanceof SynthEnrichData) {
                Log::warning('Failed to enrich transaction data', [
                    'transaction_id' => $this->transaction->id,
                    'description' => $description,
                ]);

                return;
            }

            // Save new enrichment to database
            $merchant = $this->createOrUpdateMerchant($enrichmentData);
            $this->attachMerchantToTransaction($merchant);

            Log::info('Successfully enriched transaction with new merchant', [
                'transaction_id' => $this->transaction->id,
                'merchant_id' => $merchant->id,
                'merchant_name' => $merchant->name,
            ]);
        } catch (Exception $e) {
            Log::error('Error enriching transaction', [
                'transaction_id' => $this->transaction->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e;
        }
    }

    /**
     * Find the best matching merchant for the transaction.
     */
    private function findBestMatchingMerchant(): ?Merchant
    {
        /** @var Merchant|null */
        return Merchant::search($this->transaction->name)
            ->latest()
            ->first();
    }

    private function createOrUpdateMerchant(SynthEnrichData $enrichmentData): Merchant
    {
        return Merchant::updateOrCreate([
            'external_id' => $enrichmentData->merchantId ?? 'mer_'.PrefixedIds::getUniqueId(),
        ], [
            'name' => $enrichmentData->merchant,
            'category' => $enrichmentData->category ?? '',
            'website' => $enrichmentData->website ?? '',
            'icon' => $enrichmentData->icon ?? '',
            'address' => $enrichmentData->address?->toJson(),
            'is_system' => true,
            'public_id' => 'mch_'.PrefixedIds::getUniqueId(),
        ]);
    }

    private function attachMerchantToTransaction(Merchant $merchant): void
    {
        $this->transaction->update([
            'merchant_id' => $merchant->id,
            'enriched_at' => now(),
        ]);
        $this->transaction->refresh();
    }
}

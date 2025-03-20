<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Merchant;
use App\Models\Transaction;
use App\Services\SynthService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

final class EnrichTransactionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private readonly Transaction $transaction
    ) {}

    public function handle(SynthService $synth): void
    {
        $description = "{$this->transaction->name} - {$this->transaction->note}";

        // Clean and prepare search terms
        $searchTerms = collect(explode(' ', $description))
            ->map(fn ($term): string => trim((string) $term, '- .,!?()[]{}:;'))
            ->filter(fn ($term): bool => mb_strlen((string) $term) > 2)
            ->map(fn ($term): string => str_replace(['&', '|', '!'], '', $term))
            ->filter();

        $existingMerchant = Merchant::query()
            ->select('*')
            ->where(function ($query) use ($searchTerms): void {
                // First try exact match on transaction name
                $query->where('name', 'ilike', "%{$this->transaction->name}%");

                // Then try individual terms
                $searchTerms->each(function ($term) use ($query): void {
                    $query->orWhere('name', 'ilike', "%{$term}%");
                });
            })
            ->orderByRaw('length(merchant_name) ASC') // Prefer shorter merchant names (usually more precise)
            ->first();

        if ($existingMerchant) {
            // Attach existing enrichment to transaction
            $this->transaction->update([
                'merchant_id' => $existingMerchant->id,
                'enriched_at' => now(),
            ]);
            $this->transaction->refresh();

            return;
        }

        // If no existing enrichment found, fetch from SynthService
        $enrichmentData = $synth->enrichTransaction($description, $this->transaction->category->name ?? '');

        if (! $enrichmentData instanceof \App\Data\Synth\SynthEnrichData) {
            return;
        }

        // Save new enrichment to database
        $merchantId = Merchant::upsert([
            'name' => $enrichmentData->merchant,
            'category' => $enrichmentData->category ?? '',
            'website' => $enrichmentData->website ?? '',
            'icon' => $enrichmentData->icon ?? '',
            'address' => $enrichmentData->address?->toJson(),
        ], ['merchant_id']);

        // Attach new enrichment to transaction
        $this->transaction->update([
            'merchant_id' => $merchantId,
            'enriched_at' => now(),
        ]);
    }
}

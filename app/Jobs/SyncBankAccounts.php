<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Data\Finance\TransactionData;
use App\Enums\Banking\ConnectionStatus;
use App\Enums\Finance\TransactionType;
use App\Models\Account;
use App\Models\BankConnection;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\Workspace;
use App\Services\FinanceCoreService;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Spatie\PrefixedIds\PrefixedIds;
use Throwable;

final class SyncBankAccounts implements ShouldBeUnique, ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 60;

    /**
     * The number of seconds after which the job's unique lock will be released.
     */
    public int $uniqueFor = 3600; // 1 hour

    /**
     * The workspace instance.
     */
    private Workspace $workspace;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public readonly int $workspaceId,
        public readonly int $bankConnectionId,
        public readonly ?bool $isManualSync = false,
    ) {
        $this->onQueue('financial');
        $this->workspace = Workspace::findOrFail($this->workspaceId);
    }

    /**
     * The unique ID of the job.
     */
    public function uniqueId(): string
    {
        return "{$this->bankConnectionId}-{$this->workspaceId}";
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $bankConnection = BankConnection::find($this->bankConnectionId);

        if (! $bankConnection) {
            Log::error('Bank connection not found', [
                'bank_connection_id' => $this->bankConnectionId,
                'workspace_id' => $this->workspaceId,
            ]);

            throw new Exception('Bank connection not found');
        }

        $financeCore = new FinanceCoreService(
            providerConnectionId: $bankConnection->provider_connection_id ?? '',
            providerType: $bankConnection->provider_type,
            accessToken: $bankConnection->access_token,
        );

        $connectionStatus = $financeCore->getConnectionStatus();

        Log::info('Bank connection status', [
            'bank_connection_id' => $this->bankConnectionId,
            'workspace_id' => $this->workspaceId,
            'status' => $connectionStatus,
        ]);

        if ($connectionStatus['status'] === 'connected') {
            // Update the bank connection status to connected
            BankConnection::whereId($this->bankConnectionId)->update([
                'status' => ConnectionStatus::Connected,
                'last_sync_at' => now(),
            ]);

            $accounts = Account::whereHas('bankConnection', function ($query): void {
                $query->whereId($this->bankConnectionId);
            })
                ->select(
                    'id',
                    'external_id',
                    'bankConnection.id',
                    'bankConnection.provider_connection_id',
                    'bankConnection.provider_type',
                    'bankConnection.access_token',
                    'bankConnection.status',
                )
                ->get();

            if (! $accounts->count()) {
                Log::info('No accounts found for bank connection', [
                    'bank_connection_id' => $this->bankConnectionId,
                    'workspace_id' => $this->workspaceId,
                ]);

                return;
            }

            foreach ($accounts as $account) {
                $this->syncAccount($account, $this->isManualSync);
            }

            Log::info('Bank accounts synced', [
                'bank_connection_id' => $this->bankConnectionId,
                'workspace_id' => $this->workspaceId,
            ]);
        }

        if ($connectionStatus['status'] === 'disconnected') {
            Log::info('Bank connection disconnected', [
                'bank_connection_id' => $this->bankConnectionId,
                'workspace_id' => $this->workspaceId,
            ]);

            BankConnection::whereId($this->bankConnectionId)->update([
                'status' => ConnectionStatus::Disconnected,
            ]);
        }
    }

    /**
     * Sync the account balance and transactions
     */
    private function syncAccount(Account $account, ?bool $isManualSync = false): void
    {
        if (! $account->bankConnection) {
            Log::error('Bank connection not found for account', [
                'account_id' => $account->id,
            ]);

            return;
        }

        $financeCore = new FinanceCoreService(
            providerConnectionId: $account->bankConnection->provider_connection_id ?? '',
            providerType: $account->bankConnection->provider_type,
            accessToken: $account->bankConnection->access_token,
        );

        // First update the balance
        try {
            if (! $account->external_id) {
                Log::error('Account external ID not found', [
                    'account_id' => $account->id,
                ]);

                return;
            }

            $balance = $financeCore->getAccountBalances($account->external_id);

            $amount = $balance->amount ?? 0;

            Log::info('Account balance', [
                'bank_connection_id' => $this->bankConnectionId,
                'workspace_id' => $this->workspaceId,
                'account_id' => $account->id,
                'amount' => $amount,
            ]);

            if ($amount > 0) {
                $account->update([
                    'current_balance' => $balance->amount,
                ]);
            }

            $account->bankConnection()->update([
                'error_message' => null,
            ]);
        } catch (Throwable $th) {
            Log::error('Error syncing account balance', [
                'bank_connection_id' => $this->bankConnectionId,
                'workspace_id' => $this->workspaceId,
                'account_id' => $account->id,
                'error' => $th->getMessage(),
            ]);

            $account->bankConnection()->update([
                'error_message' => $th->getMessage(),
            ]);

            throw $th;
        }

        // Then update the transactions
        try {
            $transactions = $financeCore->getTransactions(
                $account->external_id,
                // If the transactions are being synced manually, we want to get all transactions
                $isManualSync,
            );

            // Reset error details and retries if we successfully got the transactions
            $account->bankConnection()->update([
                'error_message' => null,
            ]);

            if ($transactions->count() === 0) {
                Log::info('No transactions found for account', [
                    'bank_connection_id' => $this->bankConnectionId,
                    'workspace_id' => $this->workspaceId,
                    'account_id' => $account->id,
                ]);

                return;
            }

            // Cache system categories for the duration of this job
            /** @var Collection<string, Category> $systemCategories */
            $systemCategories = Cache::remember('system_categories', 3600, fn () => Category::whereIsSystem(true)
                ->get(['id', 'slug'])
                ->keyBy('slug'));

            // Get default 'other' category ID once
            $defaultCategoryId = $systemCategories->get('other')?->id;

            if (! $defaultCategoryId) {
                throw new Exception("Default 'other' category not found");
            }

            $transactionsData = $transactions->map(fn (TransactionData $transaction): array => [
                'name' => $transaction->name,
                'note' => $transaction->note,
                'status' => $transaction->status,
                'type' => (float) $transaction->amount < 0 ? TransactionType::Expense : TransactionType::Income,
                'dated_at' => $transaction->datedAt,
                'amount' => (float) $transaction->amount,
                'currency' => $transaction->currency,
                'is_recurring' => false,
                'is_manual' => false,
                'external_id' => $transaction->id,
                'account_id' => $account->id,
                'workspace_id' => $this->workspaceId,
                'category_id' => $systemCategories->get($transaction->categorySlug)->id ?? $defaultCategoryId,
                'public_id' => 'txn_'.PrefixedIds::getUniqueId(),
            ])->toArray();

            Transaction::upsert($transactionsData, ['external_id']);

            if ($this->workspace->settings?->is_data_enrichment_enabled) {
                // Get the transactions that were just upserted
                $transactions = Transaction::whereIn('external_id', array_column($transactionsData, 'external_id'))->get();

                // Trigger enrichment jobs for each transaction
                $this->enrichTransactions($transactions);
            }
        } catch (Throwable $th) {
            Log::error('Error syncing transactions', [
                'bank_connection_id' => $this->bankConnectionId,
                'workspace_id' => $this->workspaceId,
                'account_id' => $account->id,
                'error' => $th->getMessage(),
            ]);

            throw $th;
        }
    }

    /**
     * Enrich the transactions
     *
     * @param  Collection<int, Transaction>  $transactions
     */
    private function enrichTransactions(Collection $transactions): void
    {
        foreach ($transactions as $transaction) {
            EnrichTransactionJob::dispatch($transaction);
        }
    }
}

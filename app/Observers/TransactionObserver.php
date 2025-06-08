<?php

declare(strict_types=1);

namespace App\Observers;

use App\Facades\BalanceUpdate;
use App\Jobs\EnrichTransactionJob;
use App\Models\Transaction;

final class TransactionObserver
{
    /**
     * Handle the Transaction "created" event.
     */
    public function created(Transaction $transaction): void
    {
        if ($transaction->workspace->settings?->is_data_enrichment_enabled) {
            EnrichTransactionJob::dispatch($transaction);
        }

        if ($transaction->is_manual) {
            BalanceUpdate::updateBalances($transaction, false);
        }
    }

    /**
     * Handle the Transaction "deleted" event.
     */
    public function deleted(Transaction $transaction): void
    {
        /**
         * If the transaction is manual, we need to reverse the balance changes
         * by applying the opposite operation to the account balance.
         */
        if ($transaction->is_manual) {
            BalanceUpdate::updateBalances($transaction, true);
        }
    }
}

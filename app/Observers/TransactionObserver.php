<?php

declare(strict_types=1);

namespace App\Observers;

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
    }
}

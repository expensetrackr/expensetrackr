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
        EnrichTransactionJob::dispatch($transaction);
    }
}

<?php

declare(strict_types=1);

namespace App\Observers;

use App\Jobs\ProcessTransactionEnrichment;
use App\Models\Transaction;

final class TransactionObserver
{
    /**
     * Handle the Transaction "created" event.
     */
    public function created(Transaction $transaction): void
    {
        ProcessTransactionEnrichment::dispatch($transaction);
    }
}

<?php

declare(strict_types=1);

namespace App\Observers;

use App\Enums\Finance\TransactionType;
use App\Jobs\EnrichTransactionJob;
use App\Models\Transaction;
use Exception;

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

        /** @var numeric-string $amount */
        $amount = $transaction->amount;
        /** @var numeric-string $accountCurrentBalance */
        $accountCurrentBalance = $transaction->account->current_balance;

        // Convert negative amount to positive for calculations
        /** @var numeric-string $absoluteAmount */
        $absoluteAmount = ltrim((string) $amount, '-');

        if ($transaction->is_manual) {
            switch ($transaction->type) {
                case TransactionType::Expense:
                    $newCurrentBalance = bcsub($accountCurrentBalance, $absoluteAmount, 4);
                    break;
                case TransactionType::Income:
                    $newCurrentBalance = bcadd($accountCurrentBalance, $absoluteAmount, 4);
                    break;
                case TransactionType::Transfer:
                    $newCurrentBalance = $accountCurrentBalance;
                    break;
                default:
                    throw new Exception('Invalid transaction type');
            }

            $transaction->account()->update([
                'current_balance' => $newCurrentBalance,
            ]);
        }
    }
}

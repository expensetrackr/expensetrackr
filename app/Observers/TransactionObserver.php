<?php

declare(strict_types=1);

namespace App\Observers;

use App\Enums\Finance\TransactionType;
use App\Exceptions\ExchangeRateException;
use App\Facades\Forex;
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

            $updateData = [
                'current_balance' => $newCurrentBalance,
            ];

            // Handle multicurrency accounts (accounts with base currency fields)
            if ($transaction->account->base_currency !== null && $transaction->account->base_current_balance !== null) {
                $newBaseCurrentBalance = $this->updateBaseBalance(
                    (string) $transaction->account->base_current_balance,
                    $absoluteAmount,
                    $transaction->type,
                    $transaction->currency,
                    $transaction->account->base_currency
                );

                $updateData['base_current_balance'] = $newBaseCurrentBalance;
            }

            $transaction->account()->update($updateData);
        }
    }

    /**
     * Handle the Transaction "deleted" event.
     */
    public function deleted(Transaction $transaction): void
    {
        /**
         * 1. If the transaction is manual, we need to detach the amount from the account.
         * 2. If the transaction is not manual, we need to add the amount to the account.
         */
        if ($transaction->is_manual) {
            /** @var numeric-string $amount */
            $amount = $transaction->amount;
            /** @var numeric-string $accountCurrentBalance */
            $accountCurrentBalance = $transaction->account->current_balance;

            // Convert negative amount to positive for calculations
            /** @var numeric-string $absoluteAmount */
            $absoluteAmount = ltrim((string) $amount, '-');

            switch ($transaction->type) {
                case TransactionType::Expense:
                    $newCurrentBalance = bcadd($accountCurrentBalance, $absoluteAmount, 4);
                    break;
                case TransactionType::Income:
                    $newCurrentBalance = bcsub($accountCurrentBalance, $absoluteAmount, 4);
                    break;
                case TransactionType::Transfer:
                    $newCurrentBalance = $accountCurrentBalance;
                    break;
                default:
                    throw new Exception('Invalid transaction type');
            }

            $updateData = [
                'current_balance' => $newCurrentBalance,
            ];

            // Handle multicurrency accounts (accounts with base currency fields)
            if ($transaction->account->base_currency !== null && $transaction->account->base_current_balance !== null) {
                $newBaseCurrentBalance = $this->updateBaseBalanceOnDelete(
                    (string) $transaction->account->base_current_balance,
                    $absoluteAmount,
                    $transaction->type,
                    $transaction->currency,
                    $transaction->account->base_currency
                );

                $updateData['base_current_balance'] = $newBaseCurrentBalance;
            }

            $transaction->account()->update($updateData);
        }
    }

    /**
     * Update the base currency balance for multicurrency accounts.
     */
    private function updateBaseBalance(
        string $currentBaseBalance,
        string $absoluteAmount,
        TransactionType $transactionType,
        string $transactionCurrency,
        string $baseCurrency
    ): string {
        $baseAmount = $this->convertToBaseCurrency($absoluteAmount, $transactionCurrency, $baseCurrency);

        return match ($transactionType) {
            TransactionType::Expense => bcsub($currentBaseBalance, $baseAmount, 4),
            TransactionType::Income => bcadd($currentBaseBalance, $baseAmount, 4),
            TransactionType::Transfer => $currentBaseBalance,
        };
    }

    /**
     * Update the base currency balance for multicurrency accounts on deletion (reverse operations).
     */
    private function updateBaseBalanceOnDelete(
        string $currentBaseBalance,
        string $absoluteAmount,
        TransactionType $transactionType,
        string $transactionCurrency,
        string $baseCurrency
    ): string {
        $baseAmount = $this->convertToBaseCurrency($absoluteAmount, $transactionCurrency, $baseCurrency);

        return match ($transactionType) {
            TransactionType::Expense => bcadd($currentBaseBalance, $baseAmount, 4), // Reverse: add back
            TransactionType::Income => bcsub($currentBaseBalance, $baseAmount, 4),  // Reverse: subtract back
            TransactionType::Transfer => $currentBaseBalance,
        };
    }

    /**
     * Convert an amount from one currency to base currency.
     */
    private function convertToBaseCurrency(string $amount, string $fromCurrency, string $baseCurrency): string
    {
        // If currencies are the same, no conversion needed
        if ($fromCurrency === $baseCurrency) {
            return $amount;
        }

        // Get exchange rate from transaction currency to base currency
        $exchangeRate = Forex::getCachedExchangeRate($baseCurrency, $fromCurrency);

        if ($exchangeRate === null) {
            throw ExchangeRateException::failedToFetch($baseCurrency, $fromCurrency);
        }

        if (bccomp((string) $exchangeRate, '0', 6) <= 0) {
            throw ExchangeRateException::invalidRate($exchangeRate);
        }

        // Convert amount: amount_in_base = amount_in_from_currency / exchange_rate
        return bcdiv($amount, (string) $exchangeRate, 4);
    }
}

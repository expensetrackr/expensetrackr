<?php

declare(strict_types=1);

namespace App\Observers;

use App\Enums\Finance\TransactionType;
use App\Exceptions\ExchangeRateException;
use App\Facades\Forex;
use App\Jobs\EnrichTransactionJob;
use App\Models\Transaction;
use Exception;
use Illuminate\Support\Facades\DB;

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
            $this->updateAccountBalances($transaction, false);
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
            $this->updateAccountBalances($transaction, true);
        }
    }

    /**
     * Update account balances for both standard and multicurrency accounts.
     */
    private function updateAccountBalances(Transaction $transaction, bool $isReversing = false): void
    {
        /** @var numeric-string $amount */
        $amount = $transaction->amount;
        /** @var numeric-string $accountCurrentBalance */
        $accountCurrentBalance = $transaction->account->current_balance;

        // Convert negative amount to positive for calculations
        /** @var numeric-string $absoluteAmount */
        $absoluteAmount = ltrim((string) $amount, '-');

        $newCurrentBalance = match ($transaction->type) {
            TransactionType::Expense => $isReversing
                ? bcadd($accountCurrentBalance, $absoluteAmount, 4)
                : bcsub($accountCurrentBalance, $absoluteAmount, 4),
            TransactionType::Income => $isReversing
                ? bcsub($accountCurrentBalance, $absoluteAmount, 4)
                : bcadd($accountCurrentBalance, $absoluteAmount, 4),
            TransactionType::Transfer => $accountCurrentBalance,
            default => throw new Exception('Invalid transaction type'),
        };

        DB::transaction(function () use ($transaction, $newCurrentBalance, $absoluteAmount, $isReversing) {
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
                    $transaction->account->base_currency,
                    $isReversing
                );

                $updateData['base_current_balance'] = $newBaseCurrentBalance;
            }

            $transaction->account()->update($updateData);
        });
    }

    /**
     * Update the base currency balance for multicurrency accounts.
     */
    private function updateBaseBalance(
        string $currentBaseBalance,
        string $absoluteAmount,
        TransactionType $transactionType,
        string $transactionCurrency,
        string $baseCurrency,
        bool $isReversing = false
    ): string {
        $baseAmount = $this->convertToBaseCurrency($absoluteAmount, $transactionCurrency, $baseCurrency);

        return match ($transactionType) {
            TransactionType::Expense => $isReversing
                ? bcadd($currentBaseBalance, $baseAmount, 4)
                : bcsub($currentBaseBalance, $baseAmount, 4),
            TransactionType::Income => $isReversing
                ? bcsub($currentBaseBalance, $baseAmount, 4)
                : bcadd($currentBaseBalance, $baseAmount, 4),
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

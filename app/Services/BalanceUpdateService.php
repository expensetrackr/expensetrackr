<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\Finance\TransactionType;
use App\Exceptions\ExchangeRateException;
use App\Facades\Forex;
use App\Models\Transaction;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

final class BalanceUpdateService
{
    /**
     * Update account balances for both standard and multicurrency accounts.
     */
    public function updateBalances(Transaction $transaction, bool $isReversing = false): void
    {
        /** @var numeric-string $amount */
        $amount = $transaction->amount;
        /** @var numeric-string $accountCurrentBalance */
        $accountCurrentBalance = $transaction->account->current_balance;

        // Capture old balances for audit logging
        $oldCurrentBalance = $accountCurrentBalance;
        $oldBaseCurrentBalance = $transaction->account->base_current_balance;

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

        $newBaseCurrentBalance = null;

        DB::transaction(function () use ($transaction, $newCurrentBalance, $absoluteAmount, $isReversing, &$newBaseCurrentBalance) {
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

        // Audit logging after successful DB transaction
        $this->logBalanceUpdate(
            $transaction,
            $isReversing,
            $oldCurrentBalance,
            $newCurrentBalance,
            $oldBaseCurrentBalance,
            $newBaseCurrentBalance,
            $absoluteAmount
        );
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

    /**
     * Log balance update details for audit trail.
     */
    private function logBalanceUpdate(
        Transaction $transaction,
        bool $isReversing,
        string $oldCurrentBalance,
        string $newCurrentBalance,
        float|int|null $oldBaseCurrentBalance,
        ?string $newBaseCurrentBalance,
        string $absoluteAmount
    ): void {
        $logData = [
            'transaction_id' => $transaction->id,
            'transaction_public_id' => $transaction->public_id,
            'account_id' => $transaction->account->id,
            'account_public_id' => $transaction->account->public_id,
            'transaction_type' => $transaction->type->value,
            'amount' => $absoluteAmount,
            'currency' => $transaction->currency,
            'is_reversing' => $isReversing,
            'operation' => $isReversing ? 'deletion' : 'creation',
            'old_current_balance' => $oldCurrentBalance,
            'new_current_balance' => $newCurrentBalance,
            'current_balance_change' => bcsub($newCurrentBalance, $oldCurrentBalance, 4),
        ];

        // Add base currency information if available
        if ($oldBaseCurrentBalance !== null || $newBaseCurrentBalance !== null) {
            $logData['is_multicurrency'] = true;
            $logData['base_currency'] = $transaction->account->base_currency;
            $logData['old_base_current_balance'] = $oldBaseCurrentBalance ? (string) $oldBaseCurrentBalance : null;
            $logData['new_base_current_balance'] = $newBaseCurrentBalance;

            if ($oldBaseCurrentBalance !== null && $newBaseCurrentBalance !== null) {
                $logData['base_balance_change'] = bcsub($newBaseCurrentBalance, (string) $oldBaseCurrentBalance, 4);
            }
        } else {
            $logData['is_multicurrency'] = false;
        }

        Log::info('Balance update completed', $logData);
    }
}

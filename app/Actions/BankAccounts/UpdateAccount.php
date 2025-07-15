<?php

declare(strict_types=1);

namespace App\Actions\BankAccounts;

use App\Exceptions\ExchangeRateException;
use App\Facades\Forex;
use App\Models\Account;
use App\Models\CreditCard;
use App\Models\Crypto;
use App\Models\Depository;
use App\Models\Investment;
use App\Models\Loan;
use App\Models\OtherAsset;
use App\Models\OtherLiability;
use Illuminate\Support\Facades\DB;

final class UpdateAccount
{
    /**
     * Update an existing account and its associated accountable model.
     *
     * @param  array<string, mixed>  $input
     * @param  bool  $fresh  Whether to return fresh model data from database
     */
    public function handle(Account $account, array $input, bool $fresh = false): Account
    {
        return DB::transaction(function () use ($account, $input, $fresh): Account {
            // Update the main account fields
            $this->updateAccountFields($account, $input);

            // Update accountable-specific fields if provided
            $this->updateAccountableFields($account, $input);

            $account->save();

            return $fresh ? $account->fresh() : $account;
        });
    }

    /**
     * Update the main account fields.
     *
     * @param  array<string, mixed>  $input
     */
    private function updateAccountFields(Account $account, array $input): void
    {
        // Update basic fields
        if (isset($input['name'])) {
            $account->name = $input['name'];
        }

        if (isset($input['description'])) {
            $account->description = $input['description'];
        }

        if (isset($input['is_default'])) {
            // If setting as default, unset other default accounts in workspace
            if ($input['is_default'] && ! $account->is_default) {
                Account::where('workspace_id', $account->workspace_id)
                    ->where('id', '!=', $account->id)
                    ->lockForUpdate()
                    ->update(['is_default' => false]);
            }
            $account->is_default = $input['is_default'];
        }

        if (isset($input['external_id'])) {
            $account->external_id = $input['external_id'];
        }

        if (isset($input['subtype'])) {
            $account->subtype = $input['subtype'];
        }

        // Handle currency code changes
        if (isset($input['currency_code']) && $input['currency_code'] !== $account->currency_code) {
            $this->updateCurrency($account, $input['currency_code']);
        }
    }

    /**
     * Update currency-related fields when currency code changes.
     */
    private function updateCurrency(Account $account, string $newCurrencyCode): void
    {
        $currentBalance = $account->current_balance;

        if ($newCurrencyCode === 'USD') {
            // Converting to USD
            $account->currency_code = 'USD';
            $account->base_currency = null;
            $account->base_current_balance = null;
            $account->base_initial_balance = null;
            $account->currency_rate = null;
        } else {
            // Converting from USD or changing to another currency
            $exchangeRate = Forex::getCachedExchangeRate('USD', $newCurrencyCode);

            if ($exchangeRate === null) {
                throw ExchangeRateException::failedToFetch('USD', $newCurrencyCode);
            }

            if (bccomp((string) $exchangeRate, '0', 6) <= 0) {
                throw ExchangeRateException::invalidRate((string) $exchangeRate);
            }

            // Store original values in base currency
            $account->base_currency = $account->currency_code;
            $account->base_current_balance = $currentBalance;
            $account->base_initial_balance = $account->initial_balance;
            $account->currency_rate = $exchangeRate;

            // Convert to new currency
            $account->currency_code = $newCurrencyCode;
            $account->current_balance = bcmul((string) $currentBalance, (string) $exchangeRate, 4);
            $account->initial_balance = bcmul((string) $account->initial_balance, (string) $exchangeRate, 4);
        }
    }

    /**
     * Update accountable-specific fields based on account type.
     *
     * @param  array<string, mixed>  $input
     */
    private function updateAccountableFields(Account $account, array $input): void
    {
        $accountable = $account->accountable;

        if (! $accountable) {
            return;
        }

        // Get the fields to update based on the accountable type
        $fieldsToUpdate = match ($accountable::class) {
            CreditCard::class => array_filter([
                'available_credit' => $input['available_credit'] ?? null,
                'minimum_payment' => $input['minimum_payment'] ?? null,
                'apr' => $input['apr'] ?? null,
                'annual_fee' => $input['annual_fee'] ?? null,
                'expires_at' => $input['expires_at'] ?? null,
            ], fn ($value) => $value !== null),

            Loan::class => array_filter([
                'interest_rate' => $input['interest_rate'] ?? null,
                'rate_type' => $input['rate_type'] ?? null,
                'term_months' => $input['term_months'] ?? null,
            ], fn ($value) => $value !== null),

            Depository::class => array_filter([
                'routing_number' => $input['routing_number'] ?? null,
                'account_number' => $input['account_number'] ?? null,
            ], fn ($value) => $value !== null),

            Investment::class => array_filter([
                'account_number' => $input['account_number'] ?? null,
                'broker_name' => $input['broker_name'] ?? null,
            ], fn ($value) => $value !== null),

            Crypto::class => array_filter([
                'wallet_address' => $input['wallet_address'] ?? null,
                'exchange_name' => $input['exchange_name'] ?? null,
            ], fn ($value) => $value !== null),

            OtherAsset::class => array_filter([
                'asset_type' => $input['asset_type'] ?? null,
                'valuation_method' => $input['valuation_method'] ?? null,
            ], fn ($value) => $value !== null),

            OtherLiability::class => array_filter([
                'liability_type' => $input['liability_type'] ?? null,
                'creditor_name' => $input['creditor_name'] ?? null,
            ], fn ($value) => $value !== null),

            default => [],
        };

        // Only update if there are fields to update
        if (! empty($fieldsToUpdate)) {
            $accountable->update($fieldsToUpdate);
        }
    }
}

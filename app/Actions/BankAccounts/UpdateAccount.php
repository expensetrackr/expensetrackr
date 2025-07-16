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

            return $fresh ? $account->fresh(['accountable']) : $account;
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
            CreditCard::class => $this->extractFieldsToUpdate($input, [
                'available_credit',
                'minimum_payment',
                'apr',
                'annual_fee',
                'expires_at',
            ]),

            Loan::class => $this->extractFieldsToUpdate($input, [
                'interest_rate',
                'rate_type',
                'term_months',
            ]),

            Depository::class => $this->extractFieldsToUpdate($input, [
                'routing_number',
                'account_number',
            ]),

            Investment::class => $this->extractFieldsToUpdate($input, [
                'account_number',
                'broker_name',
            ]),

            Crypto::class => $this->extractFieldsToUpdate($input, [
                'wallet_address',
                'exchange_name',
            ]),

            OtherAsset::class => $this->extractFieldsToUpdate($input, [
                'asset_type',
                'valuation_method',
            ]),

            OtherLiability::class => $this->extractFieldsToUpdate($input, [
                'liability_type',
                'creditor_name',
            ]),

            default => [],
        };

        // Only update if there are fields to update
        if (! empty($fieldsToUpdate)) {
            $accountable->update($fieldsToUpdate);
        }
    }

    /**
     * Extract fields to update from input, allowing explicit null values.
     *
     * @param  array<string, mixed>  $input
     * @param  array<string>  $allowedFields
     * @return array<string, mixed>
     */
    private function extractFieldsToUpdate(array $input, array $allowedFields): array
    {
        $fieldsToUpdate = [];

        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $input)) {
                $fieldsToUpdate[$field] = $input[$field];
            }
        }

        return $fieldsToUpdate;
    }
}

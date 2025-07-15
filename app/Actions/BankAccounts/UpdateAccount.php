<?php

declare(strict_types=1);

namespace App\Actions\BankAccounts;

use App\Enums\Finance\AccountType;
use App\Exceptions\ExchangeRateException;
use App\Facades\Forex;
use App\Models\Account;
use App\Models\CreditCard;
use App\Models\Loan;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final class UpdateAccount
{
    /**
     * Update an existing account and its associated accountable model.
     *
     * @param  array<string, mixed>  $input
     */
    public function handle(Account $account, array $input): Account
    {
        return DB::transaction(function () use ($account, $input) {
            // Update the main account fields
            $this->updateAccountFields($account, $input);
            
            // Update accountable-specific fields if provided
            $this->updateAccountableFields($account, $input);
            
            $account->save();
            
            return $account->fresh();
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
            if ($input['is_default'] && !$account->is_default) {
                Account::where('workspace_id', $account->workspace_id)
                    ->where('id', '!=', $account->id)
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
            $account->current_balance = bcmul($currentBalance, (string) $exchangeRate, 4);
            $account->initial_balance = bcmul($account->initial_balance, (string) $exchangeRate, 4);
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
        
        if ($accountable instanceof CreditCard) {
            $this->updateCreditCardFields($accountable, $input);
        } elseif ($accountable instanceof Loan) {
            $this->updateLoanFields($accountable, $input);
        }
    }

    /**
     * Update credit card specific fields.
     *
     * @param  array<string, mixed>  $input
     */
    private function updateCreditCardFields(CreditCard $creditCard, array $input): void
    {
        $fieldsToUpdate = [];

        if (isset($input['available_credit'])) {
            $fieldsToUpdate['available_credit'] = $input['available_credit'];
        }

        if (isset($input['minimum_payment'])) {
            $fieldsToUpdate['minimum_payment'] = $input['minimum_payment'];
        }

        if (isset($input['apr'])) {
            $fieldsToUpdate['apr'] = $input['apr'];
        }

        if (isset($input['annual_fee'])) {
            $fieldsToUpdate['annual_fee'] = $input['annual_fee'];
        }

        if (isset($input['expires_at'])) {
            $fieldsToUpdate['expires_at'] = $input['expires_at'];
        }

        if (!empty($fieldsToUpdate)) {
            $creditCard->update($fieldsToUpdate);
        }
    }

    /**
     * Update loan specific fields.
     *
     * @param  array<string, mixed>  $input
     */
    private function updateLoanFields(Loan $loan, array $input): void
    {
        $fieldsToUpdate = [];

        if (isset($input['interest_rate'])) {
            $fieldsToUpdate['interest_rate'] = $input['interest_rate'];
        }

        if (isset($input['rate_type'])) {
            $fieldsToUpdate['rate_type'] = $input['rate_type'];
        }

        if (isset($input['term_months'])) {
            $fieldsToUpdate['term_months'] = $input['term_months'];
        }

        if (!empty($fieldsToUpdate)) {
            $loan->update($fieldsToUpdate);
        }
    }
}
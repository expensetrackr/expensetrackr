<?php

declare(strict_types=1);

namespace App\Http\Requests\Concerns;

use App\Enums\Finance\AccountSubtype;
use App\Enums\Finance\AccountType;
use App\Enums\Finance\RateType;
use App\Models\Account;
use Illuminate\Validation\Rule;

trait AccountValidationRules
{
    /**
     * Get the base validation rules for account creation/update.
     *
     * @param float|null $minBalance Minimum balance requirement
     * @param bool $includeDescription Whether to include description field
     * @param int|null $ignoreAccountId Account ID to ignore for unique validations (for updates)
     * @return array<string, array<mixed>>
     */
    protected function getAccountValidationRules(
        ?float $minBalance = 0.01,
        bool $includeDescription = true,
        ?int $ignoreAccountId = null
    ): array {
        $rules = [
            'bank_connection_id' => ['sometimes', 'nullable', 'exists:bank_connections,id'],
            'name' => ['required', 'string', 'max:255'],
            'currency_code' => ['required', 'string', 'max:3'],
            'initial_balance' => ['required', 'numeric', 'min:' . $minBalance],
            'is_default' => ['sometimes', 'boolean'],
            'type' => ['required', 'string', Rule::enum(AccountType::class)],
            'subtype' => ['sometimes', 'nullable', 'string', Rule::enum(AccountSubtype::class)],
            // Credit Card specific fields
            'available_credit' => ['required_if:type,credit_card', 'numeric', 'min:0'],
            'minimum_payment' => ['required_if:type,credit_card', 'numeric', 'min:0'],
            'apr' => ['required_if:type,credit_card', 'numeric', 'min:0'],
            'annual_fee' => ['required_if:type,credit_card', 'numeric', 'min:0'],
            'expires_at' => ['required_if:type,credit_card', 'date'],
            // Loan specific fields
            'interest_rate' => ['required_if:type,loan', 'numeric', 'min:0'],
            'rate_type' => ['required_if:type,loan', 'string', Rule::enum(RateType::class)],
            'term_months' => ['required_if:type,loan', 'integer', 'min:1'],
        ];

        // Add description field if requested
        if ($includeDescription) {
            $rules['description'] = ['sometimes', 'nullable', 'string', 'max:500'];
        }

        // Add external_id with unique validation
        if ($ignoreAccountId) {
            $rules['external_id'] = [
                'sometimes',
                'nullable',
                'string',
                'max:255',
                Rule::unique('accounts', 'external_id')->ignore($ignoreAccountId)
            ];
        } else {
            $rules['external_id'] = ['sometimes', 'nullable', 'string', 'unique:accounts,external_id', 'max:255'];
        }

        return $rules;
    }

    /**
     * Get the validation rules for account updates (all fields optional).
     *
     * @param int|null $ignoreAccountId Account ID to ignore for unique validations
     * @return array<string, array<mixed>>
     */
    protected function getAccountUpdateValidationRules(?int $ignoreAccountId = null): array
    {
        $rules = [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:500'],
            'currency_code' => ['sometimes', 'required', 'string', 'max:3'],
            'is_default' => ['sometimes', 'boolean'],
            'subtype' => ['sometimes', 'nullable', 'string', Rule::enum(AccountSubtype::class)],
            // Credit Card specific fields (optional for updates)
            'available_credit' => ['sometimes', 'numeric', 'min:0'],
            'minimum_payment' => ['sometimes', 'numeric', 'min:0'],
            'apr' => ['sometimes', 'numeric', 'min:0'],
            'annual_fee' => ['sometimes', 'numeric', 'min:0'],
            'expires_at' => ['sometimes', 'date'],
            // Loan specific fields (optional for updates)
            'interest_rate' => ['sometimes', 'numeric', 'min:0'],
            'rate_type' => ['sometimes', 'string', Rule::enum(RateType::class)],
            'term_months' => ['sometimes', 'integer', 'min:1'],
        ];

        // Add external_id with unique validation
        if ($ignoreAccountId) {
            $rules['external_id'] = [
                'sometimes',
                'nullable',
                'string',
                'max:255',
                Rule::unique('accounts', 'external_id')->ignore($ignoreAccountId)
            ];
        } else {
            $rules['external_id'] = ['sometimes', 'nullable', 'string', 'unique:accounts,external_id', 'max:255'];
        }

        return $rules;
    }

    /**
     * Get custom error messages for account validation.
     *
     * @return array<string, string>
     */
    protected function getAccountValidationMessages(): array
    {
        return [
            'name.required' => 'The account name is required.',
            'name.max' => 'The account name may not be greater than 255 characters.',
            'currency_code.required' => 'The currency code is required.',
            'currency_code.max' => 'The currency code may not be greater than 3 characters.',
            'initial_balance.required' => 'The initial balance is required.',
            'initial_balance.numeric' => 'The initial balance must be a number.',
            'initial_balance.min' => 'The initial balance must be at least :min.',
            'type.required' => 'The account type is required.',
            'available_credit.required_if' => 'The available credit is required for credit card accounts.',
            'available_credit.numeric' => 'The available credit must be a number.',
            'available_credit.min' => 'The available credit must be at least 0.',
            'minimum_payment.required_if' => 'The minimum payment is required for credit card accounts.',
            'minimum_payment.numeric' => 'The minimum payment must be a number.',
            'minimum_payment.min' => 'The minimum payment must be at least 0.',
            'apr.required_if' => 'The APR is required for credit card accounts.',
            'apr.numeric' => 'The APR must be a number.',
            'apr.min' => 'The APR must be at least 0.',
            'annual_fee.required_if' => 'The annual fee is required for credit card accounts.',
            'annual_fee.numeric' => 'The annual fee must be a number.',
            'annual_fee.min' => 'The annual fee must be at least 0.',
            'expires_at.required_if' => 'The expiration date is required for credit card accounts.',
            'expires_at.date' => 'The expiration date must be a valid date.',
            'interest_rate.required_if' => 'The interest rate is required for loan accounts.',
            'interest_rate.numeric' => 'The interest rate must be a number.',
            'interest_rate.min' => 'The interest rate must be at least 0.',
            'rate_type.required_if' => 'The rate type is required for loan accounts.',
            'term_months.required_if' => 'The term in months is required for loan accounts.',
            'term_months.integer' => 'The term in months must be an integer.',
            'term_months.min' => 'The term in months must be at least 1.',
            'description.max' => 'The description may not be greater than 500 characters.',
            'external_id.unique' => 'The external ID has already been taken.',
            'external_id.max' => 'The external ID may not be greater than 255 characters.',
        ];
    }

    /**
     * Common authorization logic for account operations.
     */
    protected function authorizeAccountOperation(): bool
    {
        return $this->user()?->can('create', Account::class) ?? false;
    }

    /**
     * Common authorization logic for account update operations.
     */
    protected function authorizeAccountUpdateOperation(): bool
    {
        $account = $this->route('account');
        return $account instanceof Account && $this->user()?->can('update', $account) ?? false;
    }
}
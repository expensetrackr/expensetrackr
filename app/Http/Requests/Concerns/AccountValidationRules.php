<?php

declare(strict_types=1);

namespace App\Http\Requests\Concerns;

use App\Enums\Finance\AccountSubtype;
use App\Enums\Finance\AccountType;
use App\Enums\Finance\RateType;
use App\Facades\Forex;
use App\Models\Account;
use App\Services\SubscriptionService;
use Illuminate\Validation\Rule;
use Spatie\QueryBuilder\QueryBuilder;

trait AccountValidationRules
{
    /**
     * Get the base validation rules for account creation/update.
     *
     * @param  float|null  $minBalance  Minimum balance requirement
     * @param  bool  $includeDescription  Whether to include description field
     * @param  int|null  $ignoreAccountId  Account ID to ignore for unique validations (for updates)
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
            'initial_balance' => ['required', 'numeric', 'min:'.$minBalance],
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
        $rules['external_id'] = $ignoreAccountId ? [
            'sometimes',
            'nullable',
            'string',
            'max:255',
            Rule::unique('accounts', 'external_id')->ignore($ignoreAccountId),
        ] : ['sometimes', 'nullable', 'string', 'unique:accounts,external_id', 'max:255'];

        return $rules;
    }

    /**
     * Get the validation rules for account updates (all fields optional).
     *
     * @param  int|null  $ignoreAccountId  Account ID to ignore for unique validations
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
        $rules['external_id'] = $ignoreAccountId ? [
            'sometimes',
            'nullable',
            'string',
            'max:255',
            Rule::unique('accounts', 'external_id')->ignore($ignoreAccountId),
        ] : ['sometimes', 'nullable', 'string', 'unique:accounts,external_id', 'max:255'];

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

    /**
     * Get enhanced validation rules with business logic.
     *
     * @param  float|null  $minBalance  Minimum balance requirement
     * @param  bool  $includeDescription  Whether to include description field
     * @param  int|null  $ignoreAccountId  Account ID to ignore for unique validations
     * @return array<string, array<mixed>>
     */
    protected function getEnhancedAccountValidationRules(
        ?float $minBalance = 0.01,
        bool $includeDescription = true,
        ?int $ignoreAccountId = null
    ): array {
        $rules = $this->getAccountValidationRules($minBalance, $includeDescription, $ignoreAccountId);

        // Add business logic validation
        $rules = array_merge($rules, [
            'currency_code' => [
                'required',
                'string',
                'max:3',
                function ($attribute, $value, $fail) {
                    $this->validateCurrencyCode($attribute, $value, $fail);
                },
            ],
            'initial_balance' => [
                'required',
                'numeric',
                "min:$minBalance",
                function ($attribute, $value, $fail) {
                    $this->validateInitialBalance($attribute, $value, $fail);
                },
            ],
            'name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) {
                    $this->validateAccountName($attribute, $value, $fail);
                },
            ],
        ]);

        // Add account limit validation
        if (! $ignoreAccountId) {
            $rules['account_limit'] = [
                function ($attribute, $value, $fail) {
                    $this->validateAccountLimit($attribute, $value, $fail);
                },
            ];
        }

        return $rules;
    }

    /**
     * Get validation rules for balance constraints.
     */
    protected function getBalanceConstraintRules(): array
    {
        return [
            'balance_constraint' => [
                function ($attribute, $value, $fail) {
                    $this->validateBalanceConstraints($attribute, $value, $fail);
                },
            ],
        ];
    }

    /**
     * Validate currency code against supported currencies.
     */
    private function validateCurrencyCode(string $attribute, mixed $value, callable $fail): void
    {
        if (! is_string($value)) {
            return;
        }

        $supportedCurrencies = Forex::getSupportedCurrencies();

        if ($supportedCurrencies && ! in_array(mb_strtoupper($value), $supportedCurrencies)) {
            $fail("The {$attribute} '{$value}' is not supported. Supported currencies: ".implode(', ', $supportedCurrencies));
        }
    }

    /**
     * Validate initial balance with business rules.
     */
    private function validateInitialBalance(string $attribute, mixed $value, callable $fail): void
    {
        if (! is_numeric($value)) {
            return;
        }

        $balance = (float) $value;

        // Check for reasonable balance limits
        if ($balance > 1000000000) { // 1 billion limit
            $fail("The {$attribute} cannot exceed 1,000,000,000.00.");
        }

        // Check for negative balances on asset accounts
        $accountType = $this->input('type');
        if ($accountType && in_array($accountType, ['depository', 'investment', 'crypto', 'other_asset'])) {
            if ($balance < 0) {
                $fail("The {$attribute} cannot be negative for asset accounts.");
            }
        }
    }

    /**
     * Validate account name for business rules.
     */
    private function validateAccountName(string $attribute, mixed $value, callable $fail): void
    {
        if (! is_string($value)) {
            return;
        }

        // Check for duplicate names in the same workspace
        $workspaceId = $this->user()?->current_workspace_id;
        if ($workspaceId) {
            $query = QueryBuilder::for(Account::class)
                ->where('workspace_id', $workspaceId)
                ->where('name', $value);

            // Exclude current account for updates
            if ($this->route('account') instanceof Account) {
                $query->where('id', '!=', $this->route('account')->id);
            }

            if ($query->exists()) {
                $fail("An account with the name '{$value}' already exists in this workspace.");
            }
        }

        // Check for reserved names
        $reservedNames = ['system', 'admin', 'root', 'default'];
        if (in_array(mb_strtolower($value), $reservedNames)) {
            $fail("The {$attribute} '{$value}' is reserved and cannot be used.");
        }
    }

    /**
     * Validate account limits based on user subscription.
     */
    private function validateAccountLimit(string $attribute, mixed $value, callable $fail): void
    {
        $user = $this->user();
        if (! $user) {
            return;
        }

        $currentAccountCount = $user->accounts()->count();
        $maxAccounts = $this->getMaxAccountsForUser($user);

        if ($currentAccountCount >= $maxAccounts) {
            $fail("You have reached the maximum number of accounts ({$maxAccounts}) for your subscription level.");
        }
    }

    /**
     * Get maximum accounts allowed for a user based on subscription.
     */
    private function getMaxAccountsForUser($user): int
    {
        return SubscriptionService::getMaxAccountsForUser($user);
    }

    /**
     * Validate balance constraints based on account type.
     */
    private function validateBalanceConstraints(string $attribute, mixed $value, callable $fail): void
    {
        $accountType = $this->input('type');
        $initialBalance = $this->input('initial_balance');

        if (! $accountType || ! is_numeric($initialBalance)) {
            return;
        }

        $balance = (float) $initialBalance;

        // Liability accounts should have positive balances (representing debt)
        if (in_array($accountType, ['credit_card', 'loan', 'other_liability'])) {
            if ($balance < 0) {
                $fail('Liability accounts should have positive balances representing the amount owed.');
            }
        }

        // Credit card specific validation
        if ($accountType === 'credit_card') {
            $availableCredit = $this->input('available_credit');
            if (is_numeric($availableCredit) && $balance > (float) $availableCredit) {
                $fail('The initial balance cannot exceed the available credit limit.');
            }
        }
    }
}

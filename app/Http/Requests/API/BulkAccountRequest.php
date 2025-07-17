<?php

declare(strict_types=1);

namespace App\Http\Requests\API;

use App\Http\Requests\Concerns\AccountValidationRules;
use App\Models\Account;
use App\Services\SubscriptionService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Spatie\QueryBuilder\QueryBuilder;

final class BulkAccountRequest extends FormRequest
{
    use AccountValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        if (! $user) {
            return false;
        }

        $routeName = $this->route()->getName();

        return match ($routeName) {
            'api.accounts.bulk.create', 'api.accounts.bulk.import' => $user->can('create', Account::class),
            'api.accounts.bulk.update' => $user->can('update', Account::class),
            'api.accounts.bulk.delete' => $user->can('delete', Account::class),
            'api.accounts.bulk.export', 'api.accounts.bulk.status' => $user->can('view', Account::class),
            default => false,
        };
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $routeName = $this->route()->getName();

        return match ($routeName) {
            'api.accounts.bulk.create' => $this->getCreateRules(),
            'api.accounts.bulk.update' => $this->getUpdateRules(),
            'api.accounts.bulk.delete' => $this->getDeleteRules(),
            'api.accounts.bulk.export' => $this->getExportRules(),
            'api.accounts.bulk.import' => $this->getImportRules(),
            'api.accounts.bulk.status' => $this->getStatusRules(),
            default => []
        };
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'accounts.required' => 'At least one account is required for bulk operations.',
            'accounts.array' => 'The accounts field must be an array.',
            'accounts.min' => 'At least one account is required.',
            'accounts.max' => 'Maximum 50 accounts allowed per bulk operation.',
            'accounts.*.name.required' => 'Each account must have a name.',
            'accounts.*.name.string' => 'Account name must be a string.',
            'accounts.*.name.max' => 'Account name cannot exceed 255 characters.',
            'accounts.*.currency_code.required' => 'Each account must have a currency code.',
            'accounts.*.currency_code.max' => 'Currency code cannot exceed 3 characters.',
            'accounts.*.initial_balance.required' => 'Each account must have an initial balance.',
            'accounts.*.initial_balance.numeric' => 'Initial balance must be a number.',
            'accounts.*.initial_balance.min' => 'Initial balance must be at least 0.01.',
            'accounts.*.type.required' => 'Each account must have a type.',
            'accounts.*.type.in' => 'Invalid account type provided.',
            'accounts.*.id.required' => 'Account ID is required for updates.',
            'accounts.*.id.exists' => 'Account ID does not exist.',
            'account_ids.required' => 'Account IDs are required for this operation.',
            'account_ids.array' => 'Account IDs must be an array.',
            'account_ids.min' => 'At least one account ID is required.',
            'account_ids.max' => 'Maximum 50 account IDs allowed.',
            'account_ids.*.required' => 'Each account ID is required.',
            'account_ids.*.string' => 'Each account ID must be a string.',
            'account_ids.*.exists' => 'Account ID does not exist.',

            // Credit card specific messages
            'accounts.*.available_credit.required_if' => 'Available credit is required for credit card accounts.',
            'accounts.*.minimum_payment.required_if' => 'Minimum payment is required for credit card accounts.',
            'accounts.*.apr.required_if' => 'APR is required for credit card accounts.',
            'accounts.*.annual_fee.required_if' => 'Annual fee is required for credit card accounts.',
            'accounts.*.expires_at.required_if' => 'Expiration date is required for credit card accounts.',

            // Loan specific messages
            'accounts.*.interest_rate.required_if' => 'Interest rate is required for loan accounts.',
            'accounts.*.rate_type.required_if' => 'Rate type is required for loan accounts.',
            'accounts.*.term_months.required_if' => 'Term in months is required for loan accounts.',
        ];
    }

    /**
     * Get custom attributes for error messages.
     */
    public function attributes(): array
    {
        return [
            'accounts.*.name' => 'account name',
            'accounts.*.description' => 'account description',
            'accounts.*.currency_code' => 'currency code',
            'accounts.*.initial_balance' => 'initial balance',
            'accounts.*.type' => 'account type',
            'accounts.*.is_default' => 'default status',
            'accounts.*.external_id' => 'external ID',
            'accounts.*.bank_connection_id' => 'bank connection',
            'accounts.*.available_credit' => 'available credit',
            'accounts.*.minimum_payment' => 'minimum payment',
            'accounts.*.apr' => 'APR',
            'accounts.*.annual_fee' => 'annual fee',
            'accounts.*.expires_at' => 'expiration date',
            'accounts.*.interest_rate' => 'interest rate',
            'accounts.*.rate_type' => 'rate type',
            'accounts.*.term_months' => 'term in months',
            'account_ids' => 'account IDs',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $this->validateAccountLimits($validator);
            $this->validateDuplicateNames($validator);
            $this->validateWorkspaceAccess($validator);
        });
    }

    /**
     * Get validation rules for bulk create.
     */
    private function getCreateRules(): array
    {
        return [
            'accounts' => ['required', 'array', 'min:1', 'max:50'],
            'accounts.*.name' => ['required', 'string', 'max:255'],
            'accounts.*.description' => ['nullable', 'string', 'max:500'],
            'accounts.*.currency_code' => ['required', 'string', 'max:3'],
            'accounts.*.initial_balance' => ['required', 'numeric', 'min:0.01'],
            'accounts.*.type' => ['required', 'string', Rule::in([
                'depository', 'credit_card', 'loan', 'investment',
                'crypto', 'other_asset', 'other_liability',
            ])],
            'accounts.*.is_default' => ['sometimes', 'boolean'],
            'accounts.*.external_id' => ['sometimes', 'string', 'max:255'],
            'accounts.*.bank_connection_id' => ['sometimes', 'integer', 'exists:bank_connections,id'],

            // Credit card specific fields
            'accounts.*.available_credit' => ['required_if:accounts.*.type,credit_card', 'numeric', 'min:0'],
            'accounts.*.minimum_payment' => ['required_if:accounts.*.type,credit_card', 'numeric', 'min:0'],
            'accounts.*.apr' => ['required_if:accounts.*.type,credit_card', 'numeric', 'min:0', 'max:100'],
            'accounts.*.annual_fee' => ['required_if:accounts.*.type,credit_card', 'numeric', 'min:0'],
            'accounts.*.expires_at' => ['required_if:accounts.*.type,credit_card', 'date'],

            // Loan specific fields
            'accounts.*.interest_rate' => ['required_if:accounts.*.type,loan', 'numeric', 'min:0', 'max:100'],
            'accounts.*.rate_type' => ['required_if:accounts.*.type,loan', 'string', Rule::in(['fixed', 'variable'])],
            'accounts.*.term_months' => ['required_if:accounts.*.type,loan', 'integer', 'min:1', 'max:600'],
        ];
    }

    /**
     * Get validation rules for bulk update.
     */
    private function getUpdateRules(): array
    {
        return [
            'accounts' => ['required', 'array', 'min:1', 'max:50'],
            'accounts.*.id' => ['required', 'string', 'exists:accounts,public_id'],
            'accounts.*.name' => ['sometimes', 'string', 'max:255'],
            'accounts.*.description' => ['sometimes', 'nullable', 'string', 'max:500'],
            'accounts.*.currency_code' => ['sometimes', 'string', 'max:3'],
            'accounts.*.is_default' => ['sometimes', 'boolean'],
            'accounts.*.external_id' => ['sometimes', 'nullable', 'string', 'max:255'],

            // Credit card specific fields
            'accounts.*.available_credit' => ['sometimes', 'numeric', 'min:0'],
            'accounts.*.minimum_payment' => ['sometimes', 'numeric', 'min:0'],
            'accounts.*.apr' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'accounts.*.annual_fee' => ['sometimes', 'numeric', 'min:0'],
            'accounts.*.expires_at' => ['sometimes', 'date'],

            // Loan specific fields
            'accounts.*.interest_rate' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'accounts.*.rate_type' => ['sometimes', 'string', Rule::in(['fixed', 'variable'])],
            'accounts.*.term_months' => ['sometimes', 'integer', 'min:1', 'max:600'],
        ];
    }

    /**
     * Get validation rules for bulk delete.
     */
    private function getDeleteRules(): array
    {
        return [
            'account_ids' => ['required', 'array', 'min:1', 'max:50'],
            'account_ids.*' => ['required', 'string', 'exists:accounts,public_id'],
            'force' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Get validation rules for bulk export.
     */
    private function getExportRules(): array
    {
        return [
            'account_ids' => ['sometimes', 'array', 'max:100'],
            'account_ids.*' => ['string', 'exists:accounts,public_id'],
            'format' => ['sometimes', 'string', Rule::in(['json', 'csv', 'xlsx'])],
            'include_transactions' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Get validation rules for bulk import.
     */
    private function getImportRules(): array
    {
        return [
            'accounts' => ['required', 'array', 'min:1', 'max:100'],
            'accounts.*.name' => ['required', 'string', 'max:255'],
            'accounts.*.description' => ['nullable', 'string', 'max:500'],
            'accounts.*.currency_code' => ['required', 'string', 'max:3'],
            'accounts.*.initial_balance' => ['required', 'numeric', 'min:0.01'],
            'accounts.*.type' => ['required', 'string', Rule::in([
                'depository', 'credit_card', 'loan', 'investment',
                'crypto', 'other_asset', 'other_liability',
            ])],
            'accounts.*.is_default' => ['sometimes', 'boolean'],
            'accounts.*.external_id' => ['sometimes', 'string', 'max:255'],
            'skip_duplicates' => ['sometimes', 'boolean'],
            'update_existing' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Get validation rules for bulk status.
     */
    private function getStatusRules(): array
    {
        return [
            'account_ids' => ['required', 'array', 'min:1', 'max:50'],
            'account_ids.*' => ['required', 'string', 'exists:accounts,public_id'],
            'include_transactions' => ['sometimes', 'boolean'],
            'include_balance_history' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Validate account limits based on user subscription.
     */
    private function validateAccountLimits($validator): void
    {
        if (! $this->route()->named('api.accounts.bulk.create')) {
            return;
        }

        $user = $this->user();
        if (! $user) {
            return;
        }

        $currentAccountCount = $user->accounts()
            ->where('workspace_id', $user->current_workspace_id)
            ->count();
        $newAccountCount = count($this->input('accounts', []));
        $totalAfterCreation = $currentAccountCount + $newAccountCount;

        $maxAccounts = $this->getMaxAccountsForUser($user);

        if ($totalAfterCreation > $maxAccounts) {
            $validator->errors()->add('accounts',
                "Creating {$newAccountCount} accounts would exceed your limit of {$maxAccounts} accounts."
            );
        }
    }

    /**
     * Validate duplicate names within the request.
     */
    private function validateDuplicateNames($validator): void
    {
        if (! in_array($this->route()->getName(), ['api.accounts.bulk.create', 'api.accounts.bulk.import'])) {
            return;
        }

        $accounts = $this->input('accounts', []);

        // Filter and validate accounts array structure
        $validAccounts = array_filter($accounts, fn ($account) => is_array($account) && array_key_exists('name', $account));

        // Only proceed if we have valid accounts with names
        if (empty($validAccounts)) {
            return;
        }

        $names = array_column($validAccounts, 'name');

        // Filter out empty or non-string names
        $validNames = array_filter($names, fn ($name) => is_string($name) && trim($name) !== '');

        if (empty($validNames)) {
            return;
        }

        $duplicates = array_diff_assoc($validNames, array_unique($validNames));

        if (! empty($duplicates)) {
            $validator->errors()->add('accounts',
                'Duplicate account names found: '.implode(', ', array_unique($duplicates))
            );
        }
    }

    /**
     * Validate workspace access for account IDs.
     */
    private function validateWorkspaceAccess($validator): void
    {
        if (! $this->has('account_ids')) {
            return;
        }

        $user = $this->user();
        if (! $user) {
            return;
        }

        $accountIds = $this->input('account_ids', []);
        $workspaceId = $user->current_workspace_id;

        $validAccountIds = QueryBuilder::for(Account::class)
            ->where('workspace_id', $workspaceId)
            ->whereIn('public_id', $accountIds)
            ->pluck('public_id')
            ->toArray();

        $invalidIds = array_diff($accountIds, $validAccountIds);

        if (! empty($invalidIds)) {
            $validator->errors()->add('account_ids',
                'Invalid account IDs for your workspace: '.implode(', ', $invalidIds)
            );
        }
    }

    /**
     * Get maximum accounts allowed for a user based on subscription.
     */
    private function getMaxAccountsForUser($user): int
    {
        return SubscriptionService::getMaxAccountsForUser($user);
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Finance\AccountSubtype;
use App\Enums\Finance\AccountType;
use App\Models\Account;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

final class CreateAccountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', Account::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'bank_connection_id' => ['sometimes', 'nullable', 'exists:bank_connections,id'],
            'name' => ['required', 'string', 'max:255'],
            'currency_code' => ['required', 'string', 'max:3'],
            'initial_balance' => ['required', 'numeric', 'min:50'],
            'is_default' => ['sometimes', 'boolean', 'default:false'],
            'external_id' => ['sometimes', 'nullable', 'string', 'unique:accounts,external_id', 'max:255'],
            'type' => ['required', 'string', Rule::enum(AccountType::class)],
            'subtype' => ['sometimes', 'nullable', 'string', Rule::enum(AccountSubtype::class)],
        ];
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization(): RedirectResponse
    {
        return to_route('accounts.index');
    }
}

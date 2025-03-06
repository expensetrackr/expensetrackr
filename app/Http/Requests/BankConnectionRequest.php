<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\AccountSubtype;
use App\Enums\AccountType;
use App\Enums\ProviderType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class BankConnectionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'provider_connection_id' => ['nullable', 'string'],
            'provider_type' => ['required', 'string', Rule::enum(ProviderType::class)],
            'access_token' => ['required', 'string'],
            'accounts' => ['required', 'array', 'min:1'],
            'accounts.*.institution_id' => ['string'],
            'accounts.*.institution_logo_url' => ['nullable', 'string'],
            'accounts.*.institution_name' => ['required', 'string'],
            'accounts.*.name' => ['string'],
            'accounts.*.account_id' => ['string'],
            'accounts.*.currency' => ['string'],
            'accounts.*.balance' => ['numeric', 'min:50'],
            'accounts.*.enabled' => ['boolean'],
            'accounts.*.type' => ['string', Rule::enum(AccountType::class)],
            'accounts.*.subtype' => ['string', Rule::enum(AccountSubtype::class)],
            'accounts.*.token_expires_at' => ['nullable', 'date'],
        ];
    }
}

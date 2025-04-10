<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Banking\ProviderType;
use App\Models\BankConnection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

final class BankConnectionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', BankConnection::class) ?? false;
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
            'accounts.*.type' => ['string', Rule::enum(TellerAccountType::class)],
            'accounts.*.subtype' => ['string', Rule::enum(TellerAccountSubtype::class)],
            'accounts.*.token_expires_at' => ['nullable', 'date'],
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

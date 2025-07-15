<?php

declare(strict_types=1);

namespace App\Http\Requests\API;

use App\Enums\Finance\AccountSubtype;
use App\Enums\Finance\AccountType;
use App\Enums\Finance\RateType;
use App\Models\Account;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

final class StoreAccountRequest extends FormRequest
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
            'description' => ['sometimes', 'nullable', 'string', 'max:500'],
            'currency_code' => ['required', 'string', 'max:3'],
            'initial_balance' => ['required', 'numeric', 'min:0.01'],
            'is_default' => ['sometimes', 'boolean'],
            'external_id' => ['sometimes', 'nullable', 'string', 'unique:accounts,external_id', 'max:255'],
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
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The account name is required.',
            'name.max' => 'The account name may not be greater than 255 characters.',
            'currency_code.required' => 'The currency code is required.',
            'currency_code.max' => 'The currency code may not be greater than 3 characters.',
            'initial_balance.required' => 'The initial balance is required.',
            'initial_balance.numeric' => 'The initial balance must be a number.',
            'initial_balance.min' => 'The initial balance must be at least 0.01.',
            'type.required' => 'The account type is required.',
            'available_credit.required_if' => 'The available credit is required for credit card accounts.',
            'minimum_payment.required_if' => 'The minimum payment is required for credit card accounts.',
            'apr.required_if' => 'The APR is required for credit card accounts.',
            'annual_fee.required_if' => 'The annual fee is required for credit card accounts.',
            'expires_at.required_if' => 'The expiration date is required for credit card accounts.',
            'interest_rate.required_if' => 'The interest rate is required for loan accounts.',
            'rate_type.required_if' => 'The rate type is required for loan accounts.',
            'term_months.required_if' => 'The term in months is required for loan accounts.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $validator->errors(),
            ], 422)
        );
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization(): void
    {
        throw new HttpResponseException(
            response()->json([
                'message' => 'You are not authorized to perform this action.',
            ], 403)
        );
    }
}
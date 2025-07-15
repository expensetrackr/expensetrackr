<?php

declare(strict_types=1);

namespace App\Http\Requests\API;

use App\Enums\Finance\AccountSubtype;
use App\Enums\Finance\RateType;
use App\Models\Account;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

final class UpdateAccountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $account = $this->route('account');
        return $account instanceof Account && $this->user()?->can('update', $account) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $account = $this->route('account');
        $accountId = $account instanceof Account ? $account->id : null;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:500'],
            'currency_code' => ['sometimes', 'required', 'string', 'max:3'],
            'is_default' => ['sometimes', 'boolean'],
            'external_id' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
                Rule::unique('accounts', 'external_id')->ignore($accountId)
            ],
            'subtype' => ['sometimes', 'nullable', 'string', Rule::enum(AccountSubtype::class)],
            // Credit Card specific fields (only if account is credit card type)
            'available_credit' => ['sometimes', 'numeric', 'min:0'],
            'minimum_payment' => ['sometimes', 'numeric', 'min:0'],
            'apr' => ['sometimes', 'numeric', 'min:0'],
            'annual_fee' => ['sometimes', 'numeric', 'min:0'],
            'expires_at' => ['sometimes', 'date'],
            // Loan specific fields (only if account is loan type)
            'interest_rate' => ['sometimes', 'numeric', 'min:0'],
            'rate_type' => ['sometimes', 'string', Rule::enum(RateType::class)],
            'term_months' => ['sometimes', 'integer', 'min:1'],
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
            'available_credit.numeric' => 'The available credit must be a number.',
            'available_credit.min' => 'The available credit must be at least 0.',
            'minimum_payment.numeric' => 'The minimum payment must be a number.',
            'minimum_payment.min' => 'The minimum payment must be at least 0.',
            'apr.numeric' => 'The APR must be a number.',
            'apr.min' => 'The APR must be at least 0.',
            'annual_fee.numeric' => 'The annual fee must be a number.',
            'annual_fee.min' => 'The annual fee must be at least 0.',
            'expires_at.date' => 'The expiration date must be a valid date.',
            'interest_rate.numeric' => 'The interest rate must be a number.',
            'interest_rate.min' => 'The interest rate must be at least 0.',
            'term_months.integer' => 'The term in months must be an integer.',
            'term_months.min' => 'The term in months must be at least 1.',
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
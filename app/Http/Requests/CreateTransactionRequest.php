<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Finance\TransactionRecurringInterval;
use App\Enums\Finance\TransactionType;
use App\Models\Transaction;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

final class CreateTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', Transaction::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'note' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', Rule::enum(TransactionType::class)],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'currency' => ['required', 'string', 'max:3'],
            'is_recurring' => ['required', 'boolean'],
            'recurring_interval' => ['required_if:is_recurring,true', 'nullable', 'string', Rule::enum(TransactionRecurringInterval::class)],
            'recurring_start_at' => ['required_if:is_recurring,true', 'nullable', 'date'],
            'account_id' => ['required', 'exists:accounts,public_id'],
            'category_id' => ['required', 'exists:categories,public_id'],
        ];
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization(): RedirectResponse
    {
        return to_route('transactions.index');
    }
}

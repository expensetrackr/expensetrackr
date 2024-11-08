<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Akaunting\Money\Rules\CurrencyRule;
use App\Enums\AccountType;
use App\Models\Account;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreAccountStepRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Account::class);
    }

    public function rules(): array
    {
        return match ($this->route('step')) {
            'details' => [
                'name' => ['required', 'string', 'min:3', 'max:255'],
                'description' => ['nullable', 'string', 'max:1000'],
                'type' => ['required', 'string', Rule::enum(AccountType::class)],
            ],
            'balance-and-currency' => [
                'initial_balance' => ['required'],
                'currency_code' => ['required', new CurrencyRule()],
            ],
            'review' => [],
            default => abort(404)
        };
    }
}

<?php

declare(strict_types=1);

namespace App\Actions\Transactions;

use App\Enums\Finance\TransactionType;
use App\Facades\Forex;
use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use Exception;
use Illuminate\Database\QueryException;

final class CreateTransaction
{
    /**
     * Validate and create a new transaction.
     *
     * @param  array<string, mixed>  $input
     */
    public function handle(array $input, ?bool $isManual): Transaction
    {
        try {
            $account = Account::query()
                ->wherePublicId($input['account_id'])
                ->select('id')
                ->first();

            if ($account === null) {
                throw new Exception('Account not found.');
            }

            $category = Category::query()
                ->wherePublicId($input['category_id'])
                ->select('id')
                ->first();

            if ($category === null) {
                throw new Exception('Category not found.');
            }

            $type = $input['type'];
            /** @var numeric-string $amount */
            $amount = $input['amount'];
            $currency = type($input['currency'])->asString();

            if ($type === TransactionType::Expense->value) {
                $input['amount'] = -$amount;
            }

            /**
             * If currency is !== from USD, then we are going to fetch the exchange rate from the API.
             */
            if ($currency !== 'USD') {
                /** @var numeric-string|null */
                $exchangeRate = Forex::getCachedExchangeRate('USD', $currency);

                if ($exchangeRate === null) {
                    throw new Exception('Failed to fetch exchange rate from the API.');
                }

                $input['base_amount'] = $input['amount'];
                $input['base_currency'] = $currency;
                $input['currency_rate'] = $exchangeRate;
                $input['amount'] = $amount / $exchangeRate;
                $input['currency'] = 'USD';
            }

            return Transaction::create([
                ...$input,
                'recurring_interval' => $input['recurring_interval'] ?? null,
                'recurring_start_at' => $input['is_recurring'] ? ($input['recurring_start_at'] ?? now()) : null,
                'dated_at' => $input['dated_at'] ?? now(),
                'is_manual' => $isManual,
                'account_id' => $account->id,
                'category_id' => $category->id,
                'workspace_id' => $input['workspace_id'] ?? auth()->user()?->current_workspace_id,
            ]);
        } catch (QueryException $e) {
            throw new Exception('Failed to create transaction due to database error', $e->getCode(), previous: $e);
        } catch (Exception $e) {
            throw new Exception('Failed to create transaction', $e->getCode(), previous: $e);
        }
    }
}

<?php

declare(strict_types=1);

namespace App\Actions\BankAccounts;

use App\Enums\Finance\AccountType;
use App\Exceptions\ExchangeRateException;
use App\Facades\Forex;
use App\Models\Account;
use App\Models\CreditCard;
use App\Models\Crypto;
use App\Models\Depository;
use App\Models\Investment;
use App\Models\Loan;
use App\Models\OtherAsset;
use App\Models\OtherLiability;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\DB;

final class CreateAccount
{
    /**
     * Create a new account with its associated accountable model.
     *
     * @param  array{
     *     type: string,
     *     name: string,
     *     currency_code: string,
     *     initial_balance: float|int,
     *     bank_connection_id?: int|null,
     *     is_default?: bool,
     *     external_id?: string|null,
     *     subtype?: string|null,
     *     available_credit?: float|int|null,
     *     minimum_payment?: float|int|null,
     *     apr?: float|int|null,
     *     annual_fee?: float|int|null,
     *     expires_at?: string|null,
     *     interest_rate?: float|int|null,
     *     rate_type?: string|null,
     *     term_months?: int|null
     * } $input
     */
    public function create(array $input, bool $isManual = false): Account
    {
        $isManual = $isManual || (array_key_exists('external_id', $input) && $input['external_id'] === null);
        $externalId = $input['external_id'] ?? null;

        // Convert string type to enum if needed
        $accountType = is_string($input['type']) ? AccountType::from($input['type']) : $input['type'];

        return DB::transaction(function () use ($input, $accountType, $isManual, $externalId) {
            // Create the accountable model first
            $accountable = $this->createAccountable($accountType, $input);

            $currency = $input['currency_code'];
            /** @var numeric-string $initialBalance */
            $initialBalance = (string) $input['initial_balance'];

            // Prepare account data
            $values = [
                'bank_connection_id' => $input['bank_connection_id'] ?? null,
                'name' => $input['name'],
                'currency_code' => $currency,
                'initial_balance' => $initialBalance,
                'current_balance' => $initialBalance,
                'is_default' => $input['is_default'] ?? false,
                'is_manual' => $isManual,
                'external_id' => $externalId,
                'workspace_id' => Context::get('currentWorkspace'),
                'subtype' => $input['subtype'] ?? null,
                'accountable_id' => $accountable->id,
                'accountable_type' => $accountable->getMorphClass(),
            ];

            /**
             * If currency is !== from USD, then we are going to fetch the exchange rate from the API.
             */
            if ($currency !== 'USD') {
                /** @var numeric-string|null */
                $exchangeRate = Forex::getCachedExchangeRate('USD', $currency);

                if ($exchangeRate === null) {
                    throw ExchangeRateException::failedToFetch('USD', $currency);
                }

                if (bccomp($exchangeRate, '0', 6) <= 0) {
                    throw ExchangeRateException::invalidRate($exchangeRate);
                }

                $values['base_initial_balance'] = $initialBalance;
                $values['base_current_balance'] = $initialBalance;
                $values['base_currency'] = $currency;
                $values['currency_rate'] = $exchangeRate;
                $values['initial_balance'] = bcdiv(
                    $initialBalance,
                    (string) $exchangeRate,
                    4,
                );
                $values['current_balance'] = $values['initial_balance'];
                $values['currency_code'] = 'USD';
            }

            // Always create new accounts when external_id is null (manual accounts)
            // Only use updateOrCreate for accounts with valid external_id (from external sources)
            if ($isManual || $externalId === null) {
                return Account::create($values);
            }

            return Account::updateOrCreate(
                ['external_id' => $externalId],
                $values
            );
        });
    }

    /**
     * Create the appropriate accountable model based on account type.
     */
    private function createAccountable(AccountType $accountType, array $input): Model
    {
        // Determine the account model class based on the account type
        $modelClass = match ($accountType) {
            AccountType::Depository => Depository::class,
            AccountType::Investment => Investment::class,
            AccountType::Loan => Loan::class,
            AccountType::CreditCard => CreditCard::class,
            AccountType::Crypto => Crypto::class,
            AccountType::OtherAsset => OtherAsset::class,
            AccountType::OtherLiability => OtherLiability::class,
        };

        // Create the accountable model with type-specific data
        $accountable = match ($accountType) {
            AccountType::CreditCard => new CreditCard([
                'available_credit' => $input['available_credit'] ?? null,
                'minimum_payment' => $input['minimum_payment'] ?? null,
                'apr' => $input['apr'] ?? null,
                'annual_fee' => $input['annual_fee'] ?? null,
                'expires_at' => $input['expires_at'] ?? null,
            ]),
            AccountType::Loan => new Loan([
                'interest_rate' => $input['interest_rate'] ?? null,
                'rate_type' => $input['rate_type'] ?? null,
                'term_months' => $input['term_months'] ?? null,
            ]),
            default => new $modelClass(),
        };

        $accountable->save();

        return $accountable;
    }
}

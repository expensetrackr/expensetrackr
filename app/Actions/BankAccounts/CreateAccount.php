<?php

declare(strict_types=1);

namespace App\Actions\BankAccounts;

use App\Enums\Finance\AccountType;
use App\Models\Account;
use App\Models\CreditCard;
use App\Models\Crypto;
use App\Models\Depository;
use App\Models\Investment;
use App\Models\Loan;
use App\Models\OtherAsset;
use App\Models\OtherLiability;
use Illuminate\Support\Facades\Context;

final class CreateAccount
{
    /**
     * Create an account.
     *
     * @param  array<string, mixed>  $input
     */
    public function create(array $input, bool $isManual = false): void
    {
        $isManual = $isManual || $input['externalId'] === null;

        // Determine the account model class based on the account type
        $type = match ($input['type']) {
            AccountType::Depository => Depository::class,
            AccountType::Investment => Investment::class,
            AccountType::Loan => Loan::class,
            AccountType::CreditCard => CreditCard::class,
            AccountType::Crypto => Crypto::class,
            AccountType::OtherAsset => OtherAsset::class,
            AccountType::OtherLiability => OtherLiability::class,
        };

        // Create the accountable model based on the account type with default values
        $accountable = match ($input['type']) {
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
            default => new $type(),
        };
        $accountable->save();

        $values = [
            'bank_connection_id' => $input['bank_connection_id'],
            'name' => $input['name'],
            'currency_code' => $input['currency_code'],
            'initial_balance' => $input['initial_balance'],
            'current_balance' => $input['initial_balance'],
            'is_default' => $input['is_default'],
            'is_manual' => $isManual,
            'external_id' => $input['external_id'],
            'workspace_id' => Context::get('currentWorkspace'),
            'subtype' => $input['subtype'],
            'accountable_id' => $accountable->id,
            'accountable_type' => $accountable->getMorphClass(),
        ];

        if ($isManual) {
            Account::create($values);

            return;
        }

        Account::updateOrCreate(
            [
                'external_id' => $input['external_id'],
            ],
            $values
        );
    }
}

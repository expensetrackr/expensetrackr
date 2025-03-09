<?php

declare(strict_types=1);

namespace App\Actions\BankAccounts;

use App\Data\Banking\Account\CreateAccountData;
use App\Enums\AccountType;
use App\Enums\RateType;
use App\Models\Account;
use App\Models\CreditCard;
use App\Models\Crypto;
use App\Models\Depository;
use App\Models\Investment;
use App\Models\Loan;
use App\Models\OtherAsset;
use App\Models\OtherLiability;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Context;

final class CreateAccount
{
    public function create(CreateAccountData $payload): void
    {
        // Determine the account model class based on the account type
        $type = match ($payload->type) {
            AccountType::Depository => Depository::class,
            AccountType::Investment => Investment::class,
            AccountType::Loan => Loan::class,
            AccountType::CreditCard => CreditCard::class,
            AccountType::Crypto => Crypto::class,
            AccountType::OtherAsset => OtherAsset::class,
            AccountType::OtherLiability => OtherLiability::class,
        };

        // Create the accountable model based on the account type with default values
        $accountable = match ($payload->type) {
            AccountType::CreditCard => new CreditCard([
                'available_credit' => 0,
                'minimum_payment' => 0,
                'apr' => 0,
                'annual_fee' => 0,
                'expires_at' => Carbon::now()->addYears(3),
            ]),
            AccountType::Loan => new Loan([
                'interest_rate' => 0,
                'rate_type' => RateType::Fixed,
                'term_months' => 0,
            ]),
            default => new $type(),
        };
        $accountable->save();

        Account::updateOrCreate(
            [
                'external_id' => $payload->externalId,
            ],
            [
                'bank_connection_id' => $payload->bankConnectionId,
                'name' => $payload->name,
                'currency_code' => $payload->currencyCode,
                'initial_balance' => $payload->initialBalance,
                'current_balance' => $payload->initialBalance,
                'is_default' => $payload->isDefault,
                'external_id' => $payload->externalId,
                'workspace_id' => Context::get('currentWorkspace'),
                'subtype' => $payload->subtype,
                'accountable_id' => $accountable->id,
                'accountable_type' => $accountable->getMorphClass(),
            ]);
    }
}

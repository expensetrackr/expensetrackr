<?php

declare(strict_types=1);

namespace App\Actions\BankAccounts;

use App\Data\Finance\AccountCreateData;
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
    public function create(AccountCreateData $payload, bool $isManual = false): void
    {
        $isManual = $isManual || $payload->externalId === null;

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
                'available_credit' => $payload->availableCredit,
                'minimum_payment' => $payload->minimumPayment,
                'apr' => $payload->apr,
                'annual_fee' => $payload->annualFee,
                'expires_at' => $payload->expiresAt,
            ]),
            AccountType::Loan => new Loan([
                'interest_rate' => $payload->interestRate,
                'rate_type' => $payload->rateType,
                'term_months' => $payload->termMonths,
            ]),
            default => new $type(),
        };
        $accountable->save();

        $values = [
            'bank_connection_id' => $payload->bankConnectionId,
            'name' => $payload->name,
            'currency_code' => $payload->currencyCode,
            'initial_balance' => $payload->initialBalance,
            'current_balance' => $payload->initialBalance,
            'is_default' => $payload->isDefault,
            'is_manual' => $isManual,
            'external_id' => $payload->externalId,
            'workspace_id' => Context::get('currentWorkspace'),
            'subtype' => $payload->subtype,
            'accountable_id' => $accountable->id,
            'accountable_type' => $accountable->getMorphClass(),
        ];

        if ($isManual) {
            Account::create($values);

            return;
        }

        Account::updateOrCreate(
            [
                'external_id' => $payload->externalId,
            ],
            $values
        );
    }
}

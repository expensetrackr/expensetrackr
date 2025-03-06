<?php

declare(strict_types=1);

namespace App\Actions\BankAccounts;

use App\Data\CreateBankConnectionData;
use App\Enums\AccountType;
use App\Enums\RateType;
use App\Jobs\SyncBankAccounts;
use App\Models\Account;
use App\Models\BankConnection;
use App\Models\CreditCard;
use App\Models\Crypto;
use App\Models\Depository;
use App\Models\Investment;
use App\Models\Loan;
use App\Models\OtherAsset;
use App\Models\OtherLiability;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Context;

final class CreateBankConnection
{
    /**
     * Create bank connections after the user has selected the accounts they want to connect.
     */
    public function create(CreateBankConnectionData $payload): void
    {
        $account = $payload->accounts->first();

        $bankConnection = BankConnection::updateOrCreate(
            [
                'institution_id' => $account->institutionId,
                'workspace_id' => Context::get('currentWorkspace'),
            ],
            [
                'institution_logo_url' => $account->institutionLogoUrl,
                'institution_name' => $account->institutionName,
                'provider_connection_id' => $payload->providerConnectionId,
                'provider_type' => $payload->providerType,
                'access_token' => $payload->accessToken,
                'token_expires_at' => $account->tokenExpiresAt,
            ],
        );

        foreach ($payload->accounts as $account) {
            // Determine the account model class based on the account type
            $type = match ($account->type) {
                AccountType::Depository => Depository::class,
                AccountType::Investment => Investment::class,
                AccountType::Loan => Loan::class,
                AccountType::CreditCard => CreditCard::class,
                AccountType::Crypto => Crypto::class,
                AccountType::OtherAsset => OtherAsset::class,
                AccountType::OtherLiability => OtherLiability::class,
                default => throw new Exception('Unsupported account type'),
            };

            // Create the accountable model based on the account type with default values
            $accountable = match ($account->type) {
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

            $account = Account::updateOrCreate(
                [
                    'external_id' => $account->accountId,
                ],
                [
                    'bank_connection_id' => $bankConnection->id,
                    'name' => $account->name,
                    'currency_code' => $account->currency,
                    'initial_balance' => $account->balance,
                    'current_balance' => $account->balance,
                    'is_default' => false,
                    'external_id' => $account->accountId,
                    'workspace_id' => Context::get('currentWorkspace'),
                    'subtype' => $account->subtype,
                    'accountable_id' => $accountable->id,
                    'accountable_type' => $accountable->getMorphClass(),
                ]);
        }

        // Trigger an initial sync of the accounts
        // This will run immediately for the first time
        // The scheduled job will run daily at the same time the connection was created
        SyncBankAccounts::dispatch(
            Context::get('currentWorkspace'),
            $bankConnection->id
        )->onQueue('bank-sync');
    }
}

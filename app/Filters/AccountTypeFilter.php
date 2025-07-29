<?php

declare(strict_types=1);

namespace App\Filters;

use App\Enums\Finance\AccountType;
use App\Models\Account;
use App\Models\CreditCard;
use App\Models\Crypto;
use App\Models\Depository;
use App\Models\Investment;
use App\Models\Loan;
use App\Models\OtherAsset;
use App\Models\OtherLiability;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

/** @implements Filter<Account> */
final class AccountTypeFilter implements Filter
{
    public function __invoke(Builder $query, mixed $value, string $property): void
    {
        // Convert string value to AccountType enum if needed
        $accountType = $value instanceof AccountType ? $value : AccountType::from($value);

        // Map AccountType enum to corresponding model class
        $modelClass = match ($accountType) {
            AccountType::Depository => Depository::class,
            AccountType::Investment => Investment::class,
            AccountType::Crypto => Crypto::class,
            AccountType::OtherAsset => OtherAsset::class,
            AccountType::CreditCard => CreditCard::class,
            AccountType::Loan => Loan::class,
            AccountType::OtherLiability => OtherLiability::class,
        };

        $query->where('accountable_type', $modelClass);
    }
}

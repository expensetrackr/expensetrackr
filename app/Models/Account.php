<?php

declare(strict_types=1);

namespace App\Models;

use Akaunting\Money\Casts\CurrencyCast;
use Akaunting\Money\Casts\MoneyCast;
use App\Concerns\Blamable;
use App\Concerns\WorkspaceOwned;
use Database\Factories\AccountFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\PrefixedIds\Models\Concerns\HasPrefixedId;

final class Account extends Model
{
    /** @use HasFactory<AccountFactory> */
    use Blamable, HasFactory, HasPrefixedId, WorkspaceOwned;

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'currency_code' => CurrencyCast::class,
            'initial_balance' => MoneyCast::class,
            'current_balance' => MoneyCast::class,
        ];
    }
}

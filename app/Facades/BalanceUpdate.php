<?php

declare(strict_types=1);

namespace App\Facades;

use App\Contracts\BalanceUpdateInterface;
use Illuminate\Support\Facades\Facade;

/**
 * @method static void updateBalances(\App\Models\Transaction $transaction, bool $isReversing = false)
 *
 * @see BalanceUpdateInterface
 */
final class BalanceUpdate extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return BalanceUpdateInterface::class;
    }
}

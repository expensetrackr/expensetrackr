<?php

declare(strict_types=1);

namespace App\Facades;

use App\Contracts\CurrencyHandler;
use Illuminate\Support\Facades\Facade;

/**
 * @method static bool isEnabled()
 * @method static array<string>|null getSupportedCurrencies()
 * @method static array<string, float>|null getCachedExchangeRates(string $baseCurrency, array<string> $targetCurrencies)
 * @method static float|null getCachedExchangeRate(string $baseCurrency, string $targetCurrency)
 *
 * @see CurrencyHandler
 */
final class Forex extends Facade
{
    /**
     * Determine if the Currency Exchange Rate feature is disabled.
     */
    public static function isDisabled(): bool
    {
        return ! self::isEnabled();
    }

    protected static function getFacadeAccessor(): string
    {
        return CurrencyHandler::class;
    }
}

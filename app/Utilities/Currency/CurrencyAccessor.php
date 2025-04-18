<?php

declare(strict_types=1);

namespace App\Utilities\Currency;

use Akaunting\Money\Currency as ISOCurrencies;
use App\Data\Currency\CurrencyData;
use App\Facades\Forex;
use App\Models\Currency;
use Illuminate\Support\Facades\Cache;

final class CurrencyAccessor
{
    /**
     * Get the list of supported currencies
     *
     * @return array<string>|null
     */
    public static function getForexSupportedCurrencies(): ?array
    {
        return Forex::getSupportedCurrencies();
    }

    /**
     * Get the list of supported currencies by intersecting forex supported currencies with available ISO currencies
     *
     * @return array<string> Array of currency codes (e.g. ['USD', 'EUR', 'GBP'])
     */
    public static function getSupportedCurrencies(): array
    {
        $forexSupportedCurrencies = self::getForexSupportedCurrencies();
        $allCurrencies = self::getAllCurrencies();

        if ($forexSupportedCurrencies === null || $forexSupportedCurrencies === []) {
            return array_keys($allCurrencies);
        }

        return array_intersect($forexSupportedCurrencies, array_keys($allCurrencies));
    }

    /**
     * Get the list of all currencies
     *
     * @return array<CurrencyData>
     */
    public static function getAllCurrencies(): array
    {
        return CurrencyData::collect(ISOCurrencies::getCurrencies());
    }

    /**
     * Get all currency options
     *
     * @return array<string, string>
     */
    public static function getAllCurrencyOptions(): array
    {
        $allCurrencies = self::getSupportedCurrencies();

        return array_combine($allCurrencies, $allCurrencies);
    }

    /**
     * Get all available currencies
     *
     * @return array<string, string>
     */
    public static function getAvailableCurrencies(): array
    {
        $supportedCurrencies = self::getSupportedCurrencies();

        $storedCurrencies = Currency::query()
            ->pluck('code')
            ->toArray();

        $availableCurrencies = array_diff($supportedCurrencies, $storedCurrencies);

        return array_combine($availableCurrencies, $availableCurrencies);
    }

    /**
     * Get the default currency for the current workspace
     */
    public static function getDefaultCurrency(): ?string
    {
        $workspaceId = auth()->user()?->currentWorkspace?->id;
        $cacheKey = "default_currency_{$workspaceId}";

        if ($workspaceId === null) {
            return 'USD';
        }

        /** @var string|null */
        return Cache::rememberForever($cacheKey, fn () => Currency::query()
            ->where('enabled', true)
            ->value('code'));
    }
}

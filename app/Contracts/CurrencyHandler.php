<?php

declare(strict_types=1);

namespace App\Contracts;

interface CurrencyHandler
{
    /**
     * Determine if the Currency Exchange Rate feature is enabled.
     */
    public function isEnabled(): bool;

    /**
     * Get the supported currencies.
     *
     * @return array<string>|null
     */
    public function getSupportedCurrencies(): ?array;

    /**
     * Get the exchange rates for the given base currency and target currencies.
     *
     * @param  array<string>  $targetCurrencies
     * @return array<string, int|float|string>|null
     */
    public function getExchangeRates(string $baseCurrency, array $targetCurrencies): ?array;

    /**
     * Get the cached exchange rates for the given base currency and target currencies.
     *
     * @param  array<string>  $targetCurrencies
     * @return array<string, int|float|string>|null
     */
    public function getCachedExchangeRates(string $baseCurrency, array $targetCurrencies): ?array;

    /**
     * Get the cached exchange rate for the given base currency and target currency.
     */
    public function getCachedExchangeRate(string $baseCurrency, string $targetCurrency): ?float;

    /**
     * Update the currency rates cache for the given base currency.
     *
     * @return array<string, int|float|string>|null
     */
    public function updateCurrencyRatesCache(string $baseCurrency): ?array;
}

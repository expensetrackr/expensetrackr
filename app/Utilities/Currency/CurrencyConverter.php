<?php

declare(strict_types=1);

namespace App\Utilities\Currency;

use App\Services\CurrencyService;
use Filament\Forms\Set;

final class CurrencyConverter
{
    /**
     * Convert the given amount from one currency to another and set it with the new currency's precision, decimal mark and thousands separator.
     */
    public static function convertAndSet(?string $newCurrency, ?string $oldCurrency, string $amount): ?string
    {
        if ($newCurrency === null || $oldCurrency === $newCurrency) {
            return null;
        }

        $old_attr = currency($oldCurrency);
        $new_attr = currency($newCurrency);
        $temp_amount = str_replace([$old_attr->getThousandsSeparator(), $old_attr->getDecimalMark()], ['', '.'], $amount);

        return number_format((float) $temp_amount, $new_attr->getPrecision(), $new_attr->getDecimalMark(), $new_attr->getThousandsSeparator());
    }

    /**
     * Convert a monetary amount from one currency to another.
     */
    public static function convertBalance(int $amount, string $oldCurrency, string $newCurrency): int
    {
        return money($amount, $oldCurrency)->swapAmountFor($newCurrency);
    }

    public static function prepareForMutator(int $amount, string $currency): string
    {
        return money($amount, $currency)->formatSimple();
    }

    public static function prepareForAccessor(string $amount, string $currency): float|int
    {
        return money($amount, $currency, true)->getAmount();
    }

    public static function convertToCents(string|float $amount, ?string $currency = null): float|int
    {
        $currency ??= CurrencyAccessor::getDefaultCurrency();

        return money($amount, $currency, true)->getAmount();
    }

    public static function formatCentsToMoney(int $amount, ?string $currency = null): string
    {
        $currency ??= CurrencyAccessor::getDefaultCurrency();

        return money($amount, $currency)->format();
    }

    public static function handleCurrencyChange(Set $set, string $state = 'USD'): void
    {
        $currency = currency($state);
        $defaultCurrencyCode = CurrencyAccessor::getDefaultCurrency() ?? 'USD';
        $forexEnabled = app(CurrencyService::class)->isEnabled();
        $exchangeRate = $forexEnabled ? app(CurrencyService::class)->getCachedExchangeRate($defaultCurrencyCode, $state) : null;

        $set('name', $currency->getName());

        if ($forexEnabled && $exchangeRate !== null) {
            $set('rate', $exchangeRate);
        }
    }
}

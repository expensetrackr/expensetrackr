<?php

declare(strict_types=1);

namespace App\Providers;

use Akaunting\Money\Money;
use App\Utilities\Currency\CurrencyAccessor;
use Illuminate\Support\ServiceProvider;

final class MacroServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Money::macro('swapAmountFor', function ($newCurrency): int {
            $oldCurrency = $this->getCurrency()->getCurrency();
            $balanceInSubunits = $this->getAmount();

            $oldCurrencySubunit = currency($oldCurrency)->getSubunit();
            $newCurrencySubunit = currency($newCurrency)->getSubunit();

            $balanceInMajorUnits = $balanceInSubunits / $oldCurrencySubunit;

            $oldRate = currency($oldCurrency)->getRate();
            $newRate = currency($newCurrency)->getRate();

            $ratio = $newRate / $oldRate;
            $convertedBalanceInMajorUnits = $balanceInMajorUnits * $ratio;

            $roundedConvertedBalanceInMajorUnits = round($convertedBalanceInMajorUnits, currency($newCurrency)->getPrecision());

            $convertedBalanceInSubunits = $roundedConvertedBalanceInMajorUnits * $newCurrencySubunit;

            return (int) round($convertedBalanceInSubunits);
        });

        Money::macro('formatWithCode', function (bool $codeBefore = false) {
            $formatted = $this->format();

            $currencyCode = $this->getCurrency()->getCurrency();

            if ($currencyCode === CurrencyAccessor::getDefaultCurrency()) {
                return $formatted;
            }

            if ($codeBefore) {
                return $currencyCode.' '.$formatted;
            }

            return $formatted.' '.$currencyCode;
        });
    }
}

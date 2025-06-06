<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

final class ExchangeRateException extends Exception
{
    /**
     * Create an exception for when exchange rate cannot be fetched.
     */
    public static function failedToFetch(string $fromCurrency, string $toCurrency): self
    {
        return new self("Failed to fetch exchange rate from {$fromCurrency} to {$toCurrency}.");
    }

    /**
     * Create an exception for when exchange rate service is unavailable.
     */
    public static function serviceUnavailable(): self
    {
        return new self('Exchange rate service is currently unavailable.');
    }

    /**
     * Create an exception for when currency is not supported.
     */
    public static function currencyNotSupported(string $currency): self
    {
        return new self("Currency '{$currency}' is not supported by the exchange rate service.");
    }

    /**
     * Create an exception for when exchange rate is invalid.
     */
    public static function invalidRate(mixed $rate): self
    {
        return new self('Invalid exchange rate received: '.json_encode($rate));
    }
}

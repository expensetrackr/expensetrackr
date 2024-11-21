<?php

declare(strict_types=1);

namespace App\Casts;

use App\Utilities\Currency\CurrencyAccessor;
use App\Utilities\Currency\CurrencyConverter;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use UnexpectedValueException;

/**
 * @implements CastsAttributes<string|null, string|int|float|null>
 */
final class MoneyCast implements CastsAttributes
{
    /**
     * @param  array<string, string|null>  $attributes
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): string
    {
        $currency_code = $attributes['currency_code'] ?? CurrencyAccessor::getDefaultCurrency() ?? 'USD';

        if ($value !== null) {
            if (! is_numeric($value)) {
                return '';
            }

            $value = (int) $value;

            return CurrencyConverter::prepareForMutator($value, $currency_code);
        }

        return '';
    }

    /**
     * @param  array<string, string|null>  $attributes
     *
     * @throws UnexpectedValueException
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): float|int
    {
        $currency_code = $attributes['currency_code'] ?? CurrencyAccessor::getDefaultCurrency() ?? 'USD';

        if (is_numeric($value)) {
            $value = (string) $value;
        } elseif (! is_string($value)) {
            throw new UnexpectedValueException('Expected string or numeric value for money cast');
        }

        return CurrencyConverter::prepareForAccessor($value, $currency_code);
    }
}

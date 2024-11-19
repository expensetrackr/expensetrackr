<?php

declare(strict_types=1);

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use InvalidArgumentException;

/**
 * @implements CastsAttributes<float, int>
 */
final class CurrencyRateCast implements CastsAttributes
{
    private const int SCALE = 19;

    public function get($model, string $key, mixed $value, array $attributes): float
    {
        if (! is_numeric($value)) {
            throw new InvalidArgumentException('Value must be numeric');
        }

        $floatValue = $value / (10 ** self::SCALE);

        $strValue = rtrim(rtrim(number_format($floatValue, self::SCALE, '.', ''), '0'), '.');

        return (float) $strValue;
    }

    public function set($model, string $key, mixed $value, array $attributes): int
    {
        return (int) round($value * (10 ** self::SCALE));
    }
}

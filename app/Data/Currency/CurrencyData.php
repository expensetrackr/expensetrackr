<?php

declare(strict_types=1);

namespace App\Data\Currency;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapInputName(SnakeCaseMapper::class)]
final class CurrencyData extends Data
{
    public function __construct(
        public readonly string $currency,
        public readonly string $name,
        public readonly int $code,
        public readonly float $rate,
        public readonly int $precision,
        public readonly int $subunit,
        public readonly string $symbol,
        public readonly bool $symbolFirst,
        public readonly string $decimalMark,
        public readonly string $thousandsSeparator,
    ) {}
}

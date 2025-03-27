<?php

declare(strict_types=1);

namespace App\Data\BlackMarketDolar;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapName(SnakeCaseMapper::class, CamelCaseMapper::class)]
final class ArgentinaDolarItemData extends Data
{
    public function __construct(
        public readonly int|float $valueAvg,
        public readonly int|float $valueSell,
        public readonly int|float $valueBuy,
    ) {}
}

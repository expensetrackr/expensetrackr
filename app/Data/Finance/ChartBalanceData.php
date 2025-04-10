<?php

declare(strict_types=1);

namespace App\Data\Finance;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapName(SnakeCaseMapper::class, CamelCaseMapper::class)]
final class ChartBalanceData extends Data
{
    public function __construct(
        public readonly ?string $date,
        /** @var numeric-string */
        public readonly string $balance,
        /** @var numeric-string */
        public readonly string $cashBalance,
        /** @var numeric-string */
        public readonly string $holdingsBalance,
    ) {}
}

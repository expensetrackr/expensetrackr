<?php

declare(strict_types=1);

namespace App\Data\ExchangeRate;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapInputName(SnakeCaseMapper::class)]
final class LatestResponseData extends Data
{
    public function __construct(
        public readonly string $result,
        public readonly string $documentation,
        public readonly string $termsOfUse,
        public readonly int $timeLastUpdateUnix,
        public readonly string $timeLastUpdateUtc,
        public readonly int $timeNextUpdateUnix,
        public readonly string $timeNextUpdateUtc,
        public readonly string $baseCode,
        /** @var array<string, int|float> */
        public array $conversionRates,
    ) {}
}

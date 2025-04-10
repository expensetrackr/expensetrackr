<?php

declare(strict_types=1);

namespace App\Data\Finance;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class SeriesValueData extends Data
{
    public function __construct(
        public readonly CarbonImmutable $date,
        public readonly string $dateFormatted,
        public readonly TrendData $trend,
    ) {}
}

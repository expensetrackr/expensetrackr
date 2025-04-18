<?php

declare(strict_types=1);

namespace App\Data\Currency;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapName(SnakeCaseMapper::class, CamelCaseMapper::class)]
final class ArgentinaResponseData extends Data
{
    public function __construct(
        public readonly ArgentinaDollarItemData $oficial,
        public readonly ArgentinaDollarItemData $blue,
        public readonly ArgentinaDollarItemData $oficialEuro,
        public readonly ArgentinaDollarItemData $blueEuro,

    ) {}
}

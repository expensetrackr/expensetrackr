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
final class ClassificationGroupData extends Data
{
    public function __construct(
        public readonly string $key,
        public readonly string $displayName,
        public readonly string $icon,
        /** @var array<int, AccountGroupData> */
        public readonly array $accountGroups,
    ) {}
}

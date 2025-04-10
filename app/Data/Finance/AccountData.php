<?php

declare(strict_types=1);

namespace App\Data\Finance;

use App\Enums\Finance\AccountType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapName(SnakeCaseMapper::class, CamelCaseMapper::class)]
final class AccountData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        /** @var numeric-string */
        public readonly string $currentBalance,
        public readonly AccountType $type,
        public readonly float $weight,
    ) {}
}

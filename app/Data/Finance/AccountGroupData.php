<?php

declare(strict_types=1);

namespace App\Data\Finance;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class AccountGroupData extends Data
{
    public function __construct(
        public readonly string $key,
        public readonly string $name,
        public readonly string $classification,
        /** @var numeric-string */
        public readonly string $total,
        public readonly float $weight,
        public readonly string $color,
        /** @var array<int, AccountData> */
        public readonly array $accounts,
    ) {}
}

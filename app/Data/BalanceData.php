<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class BalanceData extends Data
{
    public function __construct(
        public readonly string $currency,
        public readonly int $amount,
    ) {}
}

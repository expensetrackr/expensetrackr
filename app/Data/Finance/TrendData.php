<?php

declare(strict_types=1);

namespace App\Data\Finance;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class TrendData extends Data
{
    public function __construct(
        /** @var numeric-string */
        public readonly string $current,
        /** @var numeric-string|null */
        public readonly ?string $previous,
        public readonly string $favorableDirection,
    ) {}
}

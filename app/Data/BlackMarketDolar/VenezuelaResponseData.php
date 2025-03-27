<?php

declare(strict_types=1);

namespace App\Data\BlackMarketDolar;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class VenezuelaResponseData extends Data
{
    public function __construct(
        public readonly int $status,
        public readonly int $total,
        /** @var array<VenezuelaResponseItemData> */
        public readonly array $result,
    ) {}
}

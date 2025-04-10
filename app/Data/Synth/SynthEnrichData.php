<?php

declare(strict_types=1);

namespace App\Data\Synth;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapName(SnakeCaseMapper::class, CamelCaseMapper::class)]
final class SynthEnrichData extends Data
{
    public function __construct(
        public readonly string $merchant,
        public readonly string $merchantId,
        public readonly ?string $category,
        public readonly ?string $website,
        public readonly ?string $icon,
        public readonly ?SynthEnrichAddressData $address,
    ) {}
}

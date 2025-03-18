<?php

declare(strict_types=1);

namespace App\Data\Synth;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

final class SynthEnrichData extends Data
{
    public function __construct(
        public readonly string $merchant,
        #[MapName('merchant_id')]
        public readonly string $merchantId,
        #[MapName('category')]
        public readonly ?string $category,
        public readonly ?string $website,
        public readonly ?string $icon,
        public readonly ?SynthEnrichAddressData $address,
    ) {}
}

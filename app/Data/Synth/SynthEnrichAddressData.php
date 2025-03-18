<?php

declare(strict_types=1);

namespace App\Data\Synth;

use Spatie\LaravelData\Data;

final class SynthEnrichAddressData extends Data
{
    public function __construct(
        public readonly ?string $line1,
        public readonly ?string $city,
        public readonly ?string $state,
        public readonly ?string $postalCode,
        public readonly ?string $country,
    ) {}
}

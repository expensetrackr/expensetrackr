<?php

declare(strict_types=1);

namespace App\Data\Polar;

use Spatie\LaravelData\Data;

final class PolarErrorDetail extends Data
{
    public function __construct(
        /** @var array<string|int> */
        public readonly array $loc,
        public readonly string $msg,
        public readonly string $type,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Data\Teller;

use Spatie\LaravelData\Data;

final class InstitutionData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
    ) {}
}

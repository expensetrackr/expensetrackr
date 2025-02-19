<?php

declare(strict_types=1);

namespace App\Data\Polar;

use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

final class CustomFieldOptionData extends Data
{
    public function __construct(
        #[Min(1)]
        public readonly string $value,
        #[Min(1)]
        public readonly string $label,
    ) {}
}

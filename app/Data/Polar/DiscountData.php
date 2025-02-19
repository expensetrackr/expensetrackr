<?php

declare(strict_types=1);

namespace App\Data\Polar;

use App\Enums\Polar\DiscountDuration;
use App\Enums\Polar\DiscountType;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\EnumCast;
use Spatie\LaravelData\Data;

final class DiscountData extends Data
{
    public function __construct(
        #[WithCast(EnumCast::class, type: DiscountDuration::class)]
        public readonly DiscountDuration $duration,
        #[MapInputName('duration_in_months')]
        public readonly ?int $durationInMonths,
        #[WithCast(EnumCast::class, type: DiscountType::class)]
        public readonly DiscountType $type,
        public readonly ?int $amount,
        public readonly ?string $currency,
        #[MapInputName('basis_points')]
        public readonly ?int $basisPoints,
        public readonly string $id,
        public readonly string $name,
        public readonly ?string $code,
    ) {}
}

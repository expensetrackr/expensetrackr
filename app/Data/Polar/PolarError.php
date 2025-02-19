<?php

declare(strict_types=1);

namespace App\Data\Polar;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;

final class PolarError extends Data
{
    public function __construct(
        /** @var DataCollection<int, PolarErrorDetail> */
        #[DataCollectionOf(PolarErrorDetail::class)]
        public readonly DataCollection $detail,
    ) {}
}

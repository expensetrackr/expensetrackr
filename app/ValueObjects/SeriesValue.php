<?php

declare(strict_types=1);

namespace App\ValueObjects;

use Carbon\CarbonImmutable;
use JsonSerializable;

final class SeriesValue implements JsonSerializable
{
    public function __construct(
        public readonly CarbonImmutable $date,
        public readonly string $dateFormatted,
        public readonly Trend $trend,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'date' => $this->date->toISOString(),
            'dateFormatted' => $this->dateFormatted,
            'trend' => $this->trend->jsonSerialize(),
        ];
    }
}

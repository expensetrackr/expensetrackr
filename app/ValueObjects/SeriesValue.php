<?php

declare(strict_types=1);

namespace App\ValueObjects;

use Carbon\CarbonImmutable;
use JsonSerializable;

final readonly class SeriesValue implements JsonSerializable
{
    public function __construct(
        public CarbonImmutable $date,
        public string $dateFormatted,
        public Trend $trend,
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

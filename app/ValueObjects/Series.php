<?php

declare(strict_types=1);

namespace App\ValueObjects;

use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use JsonSerializable;

final class Series implements JsonSerializable
{
    /**
     * @param  Collection<int, SeriesValue>  $values
     */
    public function __construct(
        public readonly CarbonImmutable $startDate,
        public readonly CarbonImmutable $endDate,
        public readonly string $interval,
        public readonly Trend $trend,
        public readonly Collection $values,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'startDate' => $this->startDate->toISOString(),
            'endDate' => $this->endDate->toISOString(),
            'interval' => $this->interval,
            'trend' => $this->trend->jsonSerialize(),
            'values' => $this->values->map(fn ($value) => [
                'date' => $value->date->toISOString(),
                'dateFormatted' => $value->dateFormatted,
                'trend' => $value->trend->jsonSerialize(),
            ]),
        ];
    }
}

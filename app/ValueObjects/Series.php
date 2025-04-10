<?php

declare(strict_types=1);

namespace App\ValueObjects;

use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use JsonSerializable;

final readonly class Series implements JsonSerializable
{
    /**
     * @param  Collection<int, SeriesValue>  $values
     */
    public function __construct(
        public CarbonImmutable $startDate,
        public CarbonImmutable $endDate,
        public string $interval,
        public Trend $trend,
        public Collection $values,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'startDate' => $this->startDate->toISOString(),
            'endDate' => $this->endDate->toISOString(),
            'interval' => $this->interval,
            'trend' => $this->trend->jsonSerialize(),
            'values' => $this->values->map(fn ($value): array => [
                'date' => $value->date->toISOString(),
                'dateFormatted' => $value->dateFormatted,
                'trend' => $value->trend->jsonSerialize(),
            ]),
        ];
    }
}

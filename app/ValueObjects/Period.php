<?php

declare(strict_types=1);

namespace App\ValueObjects;

use Carbon\CarbonImmutable;

final readonly class Period
{
    public function __construct(
        public CarbonImmutable $startDate,
        public CarbonImmutable $endDate,
    ) {}

    public static function last30Days(): self
    {
        return new self(
            startDate: CarbonImmutable::now()->subDays(29)->startOfDay(),
            endDate: CarbonImmutable::now()->endOfDay(),
        );
    }

    public static function lastYear(): self
    {
        return new self(
            startDate: CarbonImmutable::now()->subYear()->startOfDay(),
            endDate: CarbonImmutable::now()->endOfDay(),
        );
    }

    public function getInterval(): string
    {
        $days = $this->startDate->diffInDays($this->endDate);

        return match (true) {
            $days > 365 => '1 month',
            $days > 90 => '1 week',
            $days > 30 => '1 day',
            default => '1 hour',
        };
    }
}

<?php

declare(strict_types=1);

namespace App\ValueObjects;

use JsonSerializable;

final class Trend implements JsonSerializable
{
    public function __construct(
        public string $current,
        public ?string $previous,
        public string $favorableDirection,
    ) {}

    public function getPercentageChange(): string
    {
        // If no previous value, return 100% if current is positive, -100% if negative
        if ($this->previous === null || $this->previous === '' || $this->previous === '0') {
            $comparison = bccomp($this->current, '0.0000', 4);
            if ($comparison === 0) {
                return '0.00';
            }

            return $comparison > 0 ? '100.00' : '-100.00';
        }

        // If previous is zero, handle special case
        if (bccomp($this->previous, '0.0000', 4) === 0) {
            $comparison = bccomp($this->current, '0.0000', 4);
            if ($comparison === 0) {
                return '0.00';
            }

            return $comparison > 0 ? '100.00' : '-100.00';
        }

        // Calculate percentage change: ((current - previous) / |previous|) * 100
        // Using absolute value of previous to ensure correct sign
        $difference = bcsub($this->current, $this->previous, 4);
        $absPrevious = ltrim($this->previous, '-'); // Get absolute value of previous
        $division = bcdiv($difference, $absPrevious, 6); // Use 6 decimal places for division
        $percentage = bcmul($division, '100', 2); // Round to 2 decimal places for percentage

        return $percentage;
    }

    public function getDirection(): string
    {
        if ($this->previous === null || $this->previous === '' || $this->previous === '0') {
            return 'neutral';
        }

        $comparison = bccomp($this->current, $this->previous);

        if ($comparison === 0) {
            return 'neutral';
        }

        $isUp = $comparison > 0;

        return ($isUp && $this->favorableDirection === 'up') ||
               (! $isUp && $this->favorableDirection === 'down')
            ? 'favorable'
            : 'unfavorable';
    }

    public function jsonSerialize(): array
    {
        return [
            'current' => $this->current,
            'previous' => $this->previous,
            'favorableDirection' => $this->favorableDirection,
            'percentageChange' => $this->getPercentageChange(),
        ];
    }
}

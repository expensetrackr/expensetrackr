<?php

declare(strict_types=1);

namespace App\Data\Finance;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class TrendData extends Data
{
    public readonly string $percentageChange;

    public function __construct(
        /** @var numeric-string */
        public readonly string $current,
        /** @var numeric-string|null */
        public readonly ?string $previous,
        public readonly string $favorableDirection,
    ) {
        $this->percentageChange = $this->calculatePercentageChange();
    }

    private function calculatePercentageChange(): string
    {
        // If no previous value, we can't calculate a change
        if ($this->previous === null) {
            return '0.00';
        }

        // If both values are zero, there's no change
        if (bccomp($this->current, '0.0000', 4) === 0 && bccomp($this->previous, '0.0000', 4) === 0) {
            return '0.00';
        }

        // If previous is zero but current isn't, it's a 100% increase
        if (bccomp($this->previous, '0.0000', 4) === 0) {
            return $this->favorableDirection === 'up' ? '100.00' : '-100.00';
        }

        // Calculate the percentage change
        $change = bcsub($this->current, $this->previous, 4);
        $percentage = bcmul(bcdiv($change, $this->previous, 4), '100.0000', 2);

        return $percentage;
    }
}

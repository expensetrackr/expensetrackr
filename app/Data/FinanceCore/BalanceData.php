<?php

declare(strict_types=1);

namespace App\Data\FinanceCore;

use App\Data\Teller\TellerAccountBalanceData;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class BalanceData extends Data
{
    public function __construct(
        public readonly string $currency,
        public readonly int $amount,
    ) {}

    public static function fromTeller(TellerAccountBalanceData $balance): self
    {
        return new self(
            currency: 'USD',
            amount: (int) $balance->available,
        );
    }
}

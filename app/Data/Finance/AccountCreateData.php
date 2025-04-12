<?php

declare(strict_types=1);

namespace App\Data\Finance;

use App\Enums\Finance\AccountSubtype;
use App\Enums\Finance\AccountType;
use App\Enums\Finance\RateType;
use Illuminate\Support\Carbon;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapName(SnakeCaseMapper::class, CamelCaseMapper::class)]
final class AccountCreateData extends Data
{
    public function __construct(
        public readonly ?int $bankConnectionId,
        public readonly string $name,
        public readonly string $currencyCode,
        public readonly float $initialBalance,
        public readonly ?bool $isDefault,
        public readonly ?string $externalId,
        public readonly AccountType $type,
        public readonly ?AccountSubtype $subtype,
        // Credit Card
        public readonly ?float $availableCredit,
        public readonly ?float $minimumPayment,
        public readonly ?float $apr,
        public readonly ?float $annualFee,
        public readonly ?Carbon $expiresAt,
        // Loan
        public readonly ?float $interestRate,
        public readonly ?RateType $rateType,
        public readonly ?int $termMonths,
    ) {}
}

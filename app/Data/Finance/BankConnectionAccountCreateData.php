<?php

declare(strict_types=1);

namespace App\Data\Finance;

use App\Enums\Finance\AccountSubtype;
use App\Enums\Finance\AccountType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapName(SnakeCaseMapper::class, CamelCaseMapper::class)]
final class BankConnectionAccountCreateData extends Data
{
    public function __construct(
        public readonly string $institutionId,
        public readonly ?string $institutionLogoUrl,
        public readonly string $institutionName,
        public readonly string $name,
        public readonly string $accountId,
        public readonly string $currency,
        public readonly float $balance,
        public readonly bool $enabled,
        public readonly AccountType $type,
        public readonly AccountSubtype $subtype,
        public readonly ?string $tokenExpiresAt,
    ) {}
}

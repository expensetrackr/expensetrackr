<?php

declare(strict_types=1);

namespace App\Data\Finance;

use App\Data\Banking\TellerAccountData;
use App\Enums\Banking\ProviderType;
use App\Enums\Finance\AccountSubtype;
use App\Enums\Finance\AccountType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapName(SnakeCaseMapper::class, CamelCaseMapper::class)]
final class BankAccountData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
        public readonly string $currency,
        public readonly AccountType $type,
        public readonly AccountSubtype $subtype,
        public readonly InstitutionData $institution,
        public readonly BalanceData $balance,
        public readonly ?string $enrollmentId, // Teller only
        public readonly ?string $institutionCode, // MX only
        public readonly ?string $expiresAt,
    ) {}

    public static function fromTeller(TellerAccountData $account, BalanceData $balance): self
    {
        return new self(
            id: $account->id,
            name: $account->name,
            currency: $account->currency,
            type: AccountType::fromExternal($account->type->value),
            subtype: AccountSubtype::fromExternal($account->subtype->value),
            institution: new InstitutionData(
                id: $account->institution->id,
                name: $account->institution->name,
                logo: null,
                provider: ProviderType::Teller,
            ),
            balance: $balance,
            enrollmentId: $account->enrollmentId,
            institutionCode: null,
            expiresAt: null,
        );
    }
}

<?php

declare(strict_types=1);

namespace App\Data\Finance;

use App\Data\Banking\TellerAccountData;
use App\Enums\AccountSubtype;
use App\Enums\AccountType;
use App\Enums\ProviderType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class AccountData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
        public readonly string $currency,
        public readonly AccountType $type,
        public readonly AccountSubtype $subtype,
        public readonly InstitutionData $institution,
        public readonly BalanceData $balance,
        #[MapName('enrollment_id')]
        public readonly ?string $enrollmentId, // Teller only
        #[MapName('institution_code')]
        public readonly ?string $institutionCode, // MX only
        #[MapName('expires_at')]
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

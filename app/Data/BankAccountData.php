<?php

declare(strict_types=1);

namespace App\Data;

use App\Enums\AccountSubtype;
use App\Enums\AccountType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
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
        #[MapName('enrollment_id')]
        public readonly ?string $enrollmentId, // Teller only
        #[MapName('institution_code')]
        public readonly ?string $institutionCode, // MX only
        #[MapName('expires_at')]
        public readonly ?string $expiresAt,
    ) {}
}

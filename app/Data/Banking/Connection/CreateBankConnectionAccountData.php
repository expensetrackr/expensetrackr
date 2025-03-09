<?php

declare(strict_types=1);

namespace App\Data\Banking\Connection;

use App\Enums\AccountSubtype;
use App\Enums\AccountType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class CreateBankConnectionAccountData extends Data
{
    public function __construct(
        #[MapName('institution_id')]
        public readonly string $institutionId,
        #[MapName('institution_logo_url')]
        public readonly ?string $institutionLogoUrl,
        #[MapName('institution_name')]
        public readonly string $institutionName,
        public readonly string $name,
        #[MapName('account_id')]
        public readonly string $accountId,
        public readonly string $currency,
        public readonly float $balance,
        public readonly bool $enabled,
        public readonly AccountType $type,
        public readonly AccountSubtype $subtype,
        #[MapName('token_expires_at')]
        public readonly ?string $tokenExpiresAt,
    ) {}
}

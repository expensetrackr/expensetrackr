<?php

declare(strict_types=1);

namespace App\Data;

use App\Enums\AccountSubtype;
use App\Enums\AccountType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class CreateAccountData extends Data
{
    public function __construct(
        #[MapName('bank_connection_id')]
        public readonly ?int $bankConnectionId,
        public readonly string $name,
        #[MapName('currency_code')]
        public readonly string $currencyCode,
        #[MapName('initial_balance')]
        public readonly float $initialBalance,
        #[MapName('is_default')]
        public readonly ?bool $isDefault,
        #[MapName('external_id')]
        public readonly ?string $externalId,
        public readonly AccountType $type,
        public readonly ?AccountSubtype $subtype,
    ) {}
}

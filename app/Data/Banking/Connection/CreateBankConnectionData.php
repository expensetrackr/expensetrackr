<?php

declare(strict_types=1);

namespace App\Data\Banking\Connection;

use App\Enums\ProviderType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class CreateBankConnectionData extends Data
{
    public function __construct(
        #[MapName('provider_connection_id')]
        public readonly ?string $providerConnectionId,
        #[MapName('provider_type')]
        public readonly ProviderType $providerType,
        #[MapName('access_token')]
        public readonly string $accessToken,
        /** @var array<CreateBankConnectionAccountData> */
        public readonly array $accounts,
    ) {}
}

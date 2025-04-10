<?php

declare(strict_types=1);

namespace App\Data\Finance;

use App\Enums\Banking\ProviderType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapName(SnakeCaseMapper::class, CamelCaseMapper::class)]
final class BankConnectionCreateData extends Data
{
    public function __construct(
        public readonly ?string $providerConnectionId,
        public readonly ProviderType $providerType,
        public readonly string $accessToken,
        /** @var array<BankConnectionAccountCreateData> */
        public readonly array $accounts,
    ) {}
}

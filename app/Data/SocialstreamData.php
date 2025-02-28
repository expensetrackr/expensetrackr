<?php

declare(strict_types=1);

namespace App\Data;

use App\Data\Socialstream\ConnectedAccount;
use App\Data\Socialstream\ProviderData;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class SocialstreamData extends Data
{
    public function __construct(
        /** @var array<ProviderData> */
        public readonly array $providers,
        public readonly bool $show,
        /** @var array<ConnectedAccount> */
        public readonly array $connectedAccounts,
        public readonly bool $hasPassword,
    ) {}
}

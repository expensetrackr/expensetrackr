<?php

declare(strict_types=1);

namespace App\Data\Socialstream;

use App\Enums\Shared\SocialstreamProvider;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ProviderData extends Data
{
    public function __construct(
        public readonly SocialstreamProvider $id,
        public readonly string $name,
        public readonly ?string $buttonLabel,
    ) {}
}

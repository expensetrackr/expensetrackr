<?php

declare(strict_types=1);

namespace App\Data\Socialstream;

use App\Enums\Socialstream\Provider;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ProviderData extends Data
{
    public function __construct(
        public readonly Provider $id,
        public readonly string $name,
        public readonly ?string $buttonLabel,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Data\Banking\Institution;

use App\Enums\ProviderType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class InstitutionData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
        public ?string $logo,
        public readonly ProviderType $provider,
    ) {
        $this->logo = type(config('services.public_assets.url'))->asString()."/banks/{$id}";
    }
}

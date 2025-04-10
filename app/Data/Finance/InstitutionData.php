<?php

declare(strict_types=1);

namespace App\Data\Finance;

use App\Enums\Banking\ProviderType;
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
        $this->logo = type(config('filesystems.disks.s3.url'))->asString()."/banks/{$id}.png";
    }
}

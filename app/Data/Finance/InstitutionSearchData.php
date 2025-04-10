<?php

declare(strict_types=1);

namespace App\Data\Finance;

use App\Enums\Banking\ProviderType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class InstitutionSearchData extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public string $logo,
        /** @var array<string> */
        public array $countries,
        public int $popularity,
        public ProviderType $provider,
    ) {}
}

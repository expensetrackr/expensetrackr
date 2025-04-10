<?php

declare(strict_types=1);

namespace App\Data\Currency;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class CodesResponseData extends Data
{
    public function __construct(
        public readonly string $result,
        public readonly string $documentation,
        public readonly string $termsOfUse,
        /** @var array<int, array{string, string}> */
        #[LiteralTypeScriptType('[string, string][]')]
        public readonly array $supportedCodes,
    ) {}
}

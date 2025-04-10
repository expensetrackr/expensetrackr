<?php

declare(strict_types=1);

namespace App\Data\ExchangeRate;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapInputName(SnakeCaseMapper::class)]
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

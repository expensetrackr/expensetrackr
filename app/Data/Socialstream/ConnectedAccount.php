<?php

declare(strict_types=1);

namespace App\Data\Socialstream;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapName(SnakeCaseMapper::class, CamelCaseMapper::class)]
final class ConnectedAccount extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $provider,
        public readonly string $avatarPath,
        public readonly string $createdAt,
    ) {}
}

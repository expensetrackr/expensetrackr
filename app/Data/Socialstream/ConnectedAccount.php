<?php

declare(strict_types=1);

namespace App\Data\Socialstream;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ConnectedAccount extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $provider,
        public readonly string $avatar_path,
        public readonly string $created_at,
    ) {}
}

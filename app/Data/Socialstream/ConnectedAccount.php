<?php

declare(strict_types=1);

namespace App\Data\Socialstream;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ConnectedAccount extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $provider,
        #[MapName('avatar_path')]
        public readonly string $avatarPath,
        #[MapName('created_at')]
        public readonly string $createdAt,
    ) {}
}

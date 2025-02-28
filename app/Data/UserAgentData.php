<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class UserAgentData extends Data
{
    public function __construct(
        public readonly string $browser,
        public readonly bool $desktop,
        public readonly bool $mobile,
        public readonly bool $tablet,
        public readonly string $platform,
    ) {}
}

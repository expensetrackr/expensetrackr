<?php

declare(strict_types=1);

namespace App\Data\Auth;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class SessionData extends Data
{
    public function __construct(
        public readonly string $ip_address,
        public readonly bool $is_current_device,
        public readonly UserAgentData $device,
        public readonly string $last_active,
    ) {}
}

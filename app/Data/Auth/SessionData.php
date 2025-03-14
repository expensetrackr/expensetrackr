<?php

declare(strict_types=1);

namespace App\Data\Auth;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class SessionData extends Data
{
    public function __construct(
        #[MapName('ip_address')]
        public readonly string $ipAddress,
        #[MapName('is_current_device')]
        public readonly bool $isCurrentDevice,
        public readonly UserAgentData $device,
        #[MapName('last_active')]
        public readonly string $lastActive,
    ) {}
}

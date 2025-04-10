<?php

declare(strict_types=1);

namespace App\Data\Auth;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapName(SnakeCaseMapper::class, CamelCaseMapper::class)]
final class SessionData extends Data
{
    public function __construct(
        public readonly string $ipAddress,
        public readonly bool $isCurrentDevice,
        public readonly UserAgentData $device,
        public readonly string $lastActive,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Data\Workspace;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class WorkspaceMembershipData extends Data
{
    public function __construct(
        public readonly string $role,
    ) {}
}

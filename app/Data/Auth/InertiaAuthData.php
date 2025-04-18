<?php

declare(strict_types=1);

namespace App\Data\Auth;

use App\Data\Workspace\WorkspaceData;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class InertiaAuthData extends Data
{
    public function __construct(
        public readonly ?UserData $user,
        public readonly WorkspaceData $currentWorkspace,
        /** @var array<WorkspaceData>|null */
        public readonly ?array $workspaces,
    ) {}
}

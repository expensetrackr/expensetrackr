<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class WorkspacePermissionsData extends Data
{
    public function __construct(
        public readonly bool $canAddWorkspaceMembers,
        public readonly bool $canDeleteWorkspace,
        public readonly bool $canRemoveWorkspaceMembers,
        public readonly bool $canUpdateWorkspace,
        public readonly bool $canUpdateWorkspaceMembers,
    ) {}
}

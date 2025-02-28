<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class InertiaAuthData extends Data
{
    public function __construct(
        public readonly ?UserData $user,
        public readonly WorkspaceData|Optional|null $currentWorkspace,
        /** @var array<WorkspaceData>|Optional|null */
        public readonly array|Optional|null $workspaces,
    ) {}
}

<?php

declare(strict_types=1);

namespace App\Data\Workspace;

use App\Models\WorkspaceInvitation;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class WorkspaceInvitationData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly int $workspace_id,
        public readonly string $email,
        public readonly string $role,
    ) {}

    public static function fromModel(WorkspaceInvitation $invitation): self
    {
        return self::from([
            'id' => $invitation->id,
            'workspace_id' => $invitation->workspace_id,
            'email' => $invitation->email,
            'role' => $invitation->role,
        ]);
    }
}

<?php

declare(strict_types=1);

namespace App\Data\Workspace;

use App\Models\WorkspaceInvitation;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class WorkspaceInvitationData extends Data
{
    public function __construct(
        public readonly int $id,
        #[MapName('workspace_id')]
        public readonly int $workspaceId,
        public readonly string $email,
        public readonly string $role,
    ) {}

    public static function fromModel(WorkspaceInvitation $invitation): self
    {
        return self::from([
            'id' => $invitation->id,
            'workspaceId' => $invitation->workspace_id,
            'email' => $invitation->email,
            'role' => $invitation->role,
        ]);
    }
}

<?php

declare(strict_types=1);

namespace App\Data\Workspace;

use App\Data\Auth\UserData;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class WorkspaceData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        #[MapName('personal_workspace', 'personalWorkspace')]
        public readonly bool $personalWorkspace,
        public readonly UserData $owner,
        /** @var array<WorkspaceInvitationData> */
        public readonly array $invitations,
        /** @var array<WorkspaceMemberData> */
        public readonly array $members,
        public readonly WorkspaceSettingsData $settings,
    ) {}

    public static function fromModel(Workspace $workspace): self
    {
        return self::from([
            'id' => $workspace->id,
            'name' => $workspace->name,
            'personalWorkspace' => $workspace->personal_workspace,
            'owner' => UserData::fromModel($workspace->owner),
            'invitations' => $workspace->invitations->map(fn (WorkspaceInvitation $invitation) => WorkspaceInvitationData::fromModel($invitation)),
            'members' => $workspace->members->map(fn (User $member) => WorkspaceMembershipData::from($member)),
            'settings' => WorkspaceSettingsData::from([
                'id' => $workspace->settings->public_id,
                'isDataEnrichmentEnabled' => $workspace->settings->is_data_enrichment_enabled,
            ]),
        ]);
    }
}

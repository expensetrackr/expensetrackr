<?php

declare(strict_types=1);

namespace App\Data\Workspace;

use App\Data\Auth\UserData;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use Exception;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapName(SnakeCaseMapper::class, CamelCaseMapper::class)]
final class WorkspaceData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
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
        if ($workspace->settings === null) {
            throw new Exception('Workspace settings are not set');
        }

        if ($workspace->owner === null) {
            throw new Exception('Workspace owner is not set');
        }

        return self::from([
            'id' => $workspace->public_id,
            'name' => $workspace->name,
            'personalWorkspace' => $workspace->personal_workspace,
            'owner' => UserData::fromModel($workspace->owner),
            'invitations' => $workspace->invitations->map(fn (WorkspaceInvitation $invitation): WorkspaceInvitationData => WorkspaceInvitationData::fromModel($invitation)),
            'members' => $workspace->members->map(fn (User $member): WorkspaceMembershipData => WorkspaceMembershipData::from($member)),
            'settings' => WorkspaceSettingsData::from([
                'id' => $workspace->settings->public_id,
                'isDataEnrichmentEnabled' => $workspace->settings->is_data_enrichment_enabled,
            ]),
        ]);
    }
}

<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\User;
use App\Utilities\Workspaces\WorkspaceFeatures;

final class UserObserver
{
    public function created(User $user): void
    {
        if (WorkspaceFeatures::hasWorkspaceFeatures()) {
            $user->ownedWorkspaces()->forceCreate([
                'user_id' => $user->id,
                'name' => explode(' ', $user->name, 2)[0]."'s Workspace",
                'personal_workspace' => true,
            ]);

            setPermissionsTeamId($user->currentWorkspace->id);

            $user->assignRole('workspace admin');
        }
    }
}

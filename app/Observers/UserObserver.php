<?php

declare(strict_types=1);

namespace App\Observers;

use App\Actions\Resend\CreateContactAction;
use App\Jobs\CreateResendContactJob;
use App\Models\User;
use App\Utilities\Workspaces\WorkspaceFeatures;

final class UserObserver
{
    public function created(User $user): void
    {
        if (WorkspaceFeatures::hasWorkspaceFeatures()) {
            $workspace = $user->ownedWorkspaces()->forceCreate([
                'user_id' => $user->id,
                'name' => explode(' ', $user->name, 2)[0]."'s Workspace",
                'personal_workspace' => true,
            ]);

            $user->current_workspace_id = $workspace->id;
            $user->save();

            setPermissionsTeamId($workspace->id);

            $workspace->settings()->create([
                'workspace_id' => $workspace->id,
            ]);

            $user->assignRole('workspace admin');
        }

        CreateResendContactJob::dispatch($user->id);
    }
}

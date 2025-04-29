<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\User;
use App\Utilities\Workspaces\WorkspaceFeatures;
use Resend;

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

        $resend = Resend::client(type(config('services.resend.key'))->asString());
        $resend->contacts->create(type(config('services.resend.audience_id'))->asString(), [
            'id' => $user->id,
            'email' => $user->email,
            'first_name' => explode(' ', $user->name ?? '')[0] ?? '',
            'last_name' => explode(' ', $user->name ?? '')[1] ?? '',
            'unsubscribed' => false,
            'created_at' => now()->toString(),
        ]);
    }
}

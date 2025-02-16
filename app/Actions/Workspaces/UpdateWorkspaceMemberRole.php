<?php

declare(strict_types=1);

namespace App\Actions\Workspaces;

use App\Events\WorkspaceMemberUpdated;
use App\Models\User;
use App\Models\Workspace;

final class UpdateWorkspaceMemberRole
{
    /**
     * Update the role for the given workspace member.
     */
    public function handle(User $user, Workspace $workspace, User $member, string $role): void
    {
        tap($workspace->members->findOrFail($member->id), function (User $member) use ($role): void {
            $member->roles()->detach();
            $member->assignRole($role);
        });

        WorkspaceMemberUpdated::dispatch($workspace->fresh(), $member);
    }
}

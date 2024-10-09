<?php

declare(strict_types=1);

namespace Workspaces\Actions;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;
use Workspaces\Events\WorkspaceMemberUpdated;
use Workspaces\Rules\Role;
use Workspaces\Workspaces;

final class UpdateWorkspaceMemberRole
{
    /**
     * Update the role for the given workspace member.
     */
    public function update(mixed $user, mixed $workspace, int $workspaceMemberId, string $role): void
    {
        Gate::forUser($user)->authorize('updateWorkspaceMember', $workspace);

        Validator::make([
            'role' => $role,
        ], [
            'role' => ['required', 'string', new Role],
        ])->validate();

        $workspace->users()->updateExistingPivot($workspaceMemberId, [
            'role' => $role,
        ]);

        WorkspaceMemberUpdated::dispatch($workspace->fresh(), Workspaces::findUserByIdOrFail($workspaceMemberId));
    }
}

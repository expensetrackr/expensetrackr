<?php

declare(strict_types=1);

namespace App\Actions\Workspaces;

use App\Contracts\UpdatesWorkspaces;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\Gate;

final class UpdateWorkspace implements UpdatesWorkspaces
{
    /**
     * Validate and update the given workspaces name.
     *
     * @param  array<string, mixed>  $input
     */
    public function handle(User $user, Workspace $workspace, array $input): void
    {
        Gate::forUser($user)->authorize('update', $workspace);

        $workspace->forceFill([
            'name' => $input['name'],
        ])->save();
    }
}

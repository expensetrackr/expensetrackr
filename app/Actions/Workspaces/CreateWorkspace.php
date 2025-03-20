<?php

declare(strict_types=1);

namespace App\Actions\Workspaces;

use App\Contracts\CreatesWorkspaces;
use App\Events\AddingWorkspace;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Model;

final class CreateWorkspace implements CreatesWorkspaces
{
    /**
     * Validate and create a new workspace for the given user.
     *
     * @param  array<string, mixed>  $input
     */
    public function handle(User $user, array $input): Workspace|Model
    {
        AddingWorkspace::dispatch($user);
        $workspace = $user->ownedWorkspaces()->create([
            'name' => $input['name'],
            'personal_workspace' => false,
        ]);
        $workspace->settings()->create([
            'workspace_id' => $workspace->id,
        ]);

        $user->switchWorkspace($workspace);

        return $workspace;
    }
}

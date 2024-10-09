<?php

declare(strict_types=1);

namespace Workspaces\Actions;

use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

final class ValidateWorkspaceDeletion
{
    /**
     * Validate that the workspace can be deleted by the given user.
     */
    public function validate(mixed $user, mixed $workspace): void
    {
        Gate::forUser($user)->authorize('delete', $workspace);

        if ($workspace->personal_workspace) {
            throw ValidationException::withMessages([
                'workspace' => __('You may not delete your personal workspace.'),
            ])->errorBag('deleteWorkspace');
        }
    }
}

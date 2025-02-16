<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Workspaces\ManageWorkspaceMember;
use App\Models\User;
use App\Models\WorkspaceInvitation;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class WorkspaceInvitationController
{
    use AuthorizesRequests;

    /**
     * Accept a workspace invitation.
     */
    public function accept(Request $request, WorkspaceInvitation $invitation, ManageWorkspaceMember $action): RedirectResponse
    {
        $this->authorize('addWorkspaceMember', $invitation->workspace);

        $currentUser = type($request->user())->as(User::class);

        $action->handle(
            $currentUser,
            $invitation->workspace,
            $invitation->email,
            $invitation->role,
            true // Force direct add since we're accepting an invitation
        );

        setPermissionsTeamId($invitation->workspace->id);
        $currentUser->assignRole($invitation->role);

        $invitation->delete();

        return redirect(type(config('fortify.home'))->asString())
            ->with('toast', ['type' => 'success', 'message' => __('Great! You have accepted the invitation to join the :workspace workspace.', ['workspace' => $invitation->workspace->name])]);
    }

    /**
     * Cancel the given workspace invitation.
     */
    public function destroy(Request $request, WorkspaceInvitation $invitation): RedirectResponse
    {
        $this->authorize('removeWorkspaceMember', $invitation->workspace);

        $invitation->delete();

        return back(303);
    }
}

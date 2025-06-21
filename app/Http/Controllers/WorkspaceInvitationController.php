<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Workspaces\ManageWorkspaceMember;
use App\Models\User;
use App\Models\WorkspaceInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

final class WorkspaceInvitationController extends Controller
{
    /**
     * Accept a workspace invitation.
     */
    public function accept(Request $request, WorkspaceInvitation $invitation, ManageWorkspaceMember $action): RedirectResponse
    {
        if (! Gate::forUser($request->user())->check('addWorkspaceMember', $invitation->workspace)) {
            return to_route('workspaces.show', $invitation->workspace);
        }

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

        return redirect(route('dashboard', absolute: false))
            ->with('toast', ['type' => 'success', 'message' => __('Great! You have accepted the invitation to join the :workspace workspace.', ['workspace' => $invitation->workspace->name])]);
    }

    /**
     * Cancel the given workspace invitation.
     */
    public function destroy(Request $request, WorkspaceInvitation $invitation): RedirectResponse
    {
        if (! Gate::forUser($request->user())->check('removeWorkspaceMember', $invitation->workspace)) {
            return to_route('workspaces.show', $invitation->workspace);
        }

        $invitation->delete();

        return back(303);
    }
}

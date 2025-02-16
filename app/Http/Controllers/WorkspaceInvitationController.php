<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Workspaces\ManageWorkspaceMember;
use App\Models\User;
use App\Models\WorkspaceInvitation;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

final class WorkspaceInvitationController extends Controller
{
    use AuthorizesRequests;

    /**
     * Accept a workspace invitation.
     */
    public function accept(Request $request, WorkspaceInvitation $invitation, ManageWorkspaceMember $action): RedirectResponse
    {
        $this->authorize('addWorkspaceMember', $invitation->workspace);
        $user = type($request->user())->as(User::class);

        $action->handle(
            $user,
            $invitation->workspace,
            $invitation->email,
            $invitation->role,
            true // Force direct add since we're accepting an invitation
        );

        setPermissionsTeamId($invitation->workspace->id);
        $user->assignRole($invitation->role);

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

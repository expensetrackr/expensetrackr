<?php

declare(strict_types=1);

namespace Workspaces\Http\Controllers;

use Contracts\AddsWorkspaceMembers;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Gate;
use Workspaces\Workspaces;

final class WorkspaceInvitationController extends Controller
{
    /**
     * Accept a workspace invitation.
     */
    public function accept(Request $request, int $invitationId): RedirectResponse
    {
        $model = Workspaces::workspaceInvitationModel();

        $invitation = $model::whereKey($invitationId)->firstOrFail();

        app(AddsWorkspaceMembers::class)->add(
            $invitation->workspace->owner,
            $invitation->workspace,
            $invitation->email,
            $invitation->role
        );

        $invitation->delete();

        return redirect(config('fortify.home'))->banner(
            __('Great! You have accepted the invitation to join the :workspace workspace.', ['workspace' => $invitation->workspace->name]),
        );
    }

    /**
     * Cancel the given workspace invitation.
     */
    public function destroy(Request $request, int $invitationId): RedirectResponse
    {
        $model = Workspaces::workspaceInvitationModel();

        $invitation = $model::whereKey($invitationId)->firstOrFail();

        if (! Gate::forUser($request->user())->check('removeWorkspaceMember', $invitation->workspace)) {
            throw new AuthorizationException;
        }

        $invitation->delete();

        return back(303);
    }
}

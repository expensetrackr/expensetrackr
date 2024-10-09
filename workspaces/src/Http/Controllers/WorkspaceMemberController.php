<?php

declare(strict_types=1);

namespace Workspaces\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Workspaces\Actions\UpdateWorkspaceMemberRole;
use Workspaces\Contracts\AddsWorkspaceMembers;
use Workspaces\Contracts\InvitesWorkspaceMembers;
use Workspaces\Contracts\RemovesWorkspaceMembers;
use Workspaces\Features;
use Workspaces\Workspaces;

final class WorkspaceMemberController extends Controller
{
    /**
     * Add a new workspace member to a workspace.
     */
    public function store(Request $request, int $workspaceId): RedirectResponse
    {
        $workspace = Workspaces::newWorkspaceModel()->findOrFail($workspaceId);

        if (Features::sendsWorkspaceInvitations()) {
            app(InvitesWorkspaceMembers::class)->invite(
                $request->user(),
                $workspace,
                $request->email ?: '',
                $request->role
            );
        } else {
            app(AddsWorkspaceMembers::class)->add(
                $request->user(),
                $workspace,
                $request->email ?: '',
                $request->role
            );
        }

        return back(303);
    }

    /**
     * Update the given workspace member's role.
     */
    public function update(Request $request, int $workspaceId, int $userId): RedirectResponse
    {
        app(UpdateWorkspaceMemberRole::class)->update(
            $request->user(),
            Workspaces::newWorkspaceModel()->findOrFail($workspaceId),
            $userId,
            $request->role
        );

        return back(303);
    }

    /**
     * Remove the given user from the given workspace.
     */
    public function destroy(Request $request, int $workspaceId, int $userId): RedirectResponse
    {
        $workspace = Workspaces::newWorkspaceModel()->findOrFail($workspaceId);

        app(RemovesWorkspaceMembers::class)->remove(
            $request->user(),
            $workspace,
            $user = Workspaces::findUserByIdOrFail($userId)
        );

        if ($request->user()->id === $user->id) {
            return redirect(config('fortify.home'));
        }

        return back(303);
    }
}

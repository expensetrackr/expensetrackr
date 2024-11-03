<?php

declare(strict_types=1);

namespace Workspaces\Http\Controllers;

use App\Models\User;
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
                type($request->user())->as(User::class),
                $workspace,
                type($request->email)->asString() ?: '',
                type($request->role)->asString()
            );
        } else {
            app(AddsWorkspaceMembers::class)->add(
                type($request->user())->as(User::class),
                $workspace,
                type($request->email)->asString() ?: '',
                type($request->role)->asString()
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
            type($request->user())->as(User::class),
            Workspaces::newWorkspaceModel()->findOrFail($workspaceId),
            $userId,
            type($request->role)->asString()
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
            type($request->user())->as(User::class),
            $workspace,
            $user = Workspaces::findUserByIdOrFail($userId)
        );

        if ($request->user()?->id === $user->id) {
            return redirect(type(config('fortify.home'))->asString());
        }

        return back(303);
    }
}

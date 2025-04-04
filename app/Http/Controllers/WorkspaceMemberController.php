<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Workspaces\ManageWorkspaceMember;
use App\Actions\Workspaces\RemoveWorkspaceMember;
use App\Actions\Workspaces\UpdateWorkspaceMemberRole;
use App\Http\Requests\ManageWorkspaceMemberRequest;
use App\Http\Requests\UpdateWorkspaceMemberRequest;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

final class WorkspaceMemberController extends Controller
{
    use AuthorizesRequests;

    /**
     * Add a new workspace member to a workspace.
     */
    public function store(ManageWorkspaceMemberRequest $request, Workspace $workspace, ManageWorkspaceMember $action): RedirectResponse
    {
        $validated = $request->validated();
        $currentUser = type($request->user())->as(User::class);

        $action->handle(
            $currentUser,
            $workspace,
            type($validated['email'])->asString(),
            type($validated['role'])->asString()
        );

        return back(303);
    }

    /**
     * Update the given workspace member's role.
     */
    public function update(UpdateWorkspaceMemberRequest $request, Workspace $workspace, User $member, UpdateWorkspaceMemberRole $action): RedirectResponse
    {
        $validated = $request->validated();
        $currentUser = type($request->user())->as(User::class);

        $action->handle(
            $currentUser,
            $workspace,
            $member,
            type($validated['role'])->asString()
        );

        return back(303);
    }

    /**
     * Remove the given user from the given workspace.
     */
    public function destroy(Request $request, Workspace $workspace, User $member, RemoveWorkspaceMember $action): RedirectResponse
    {
        if (! Gate::forUser($request->user())->check('removeWorkspaceMember', $workspace)) {
            return to_route('workspaces.show', $workspace);
        }

        $currentUser = type($request->user())->as(User::class);

        $action->handle(
            $currentUser,
            $workspace,
            $member
        );

        if ($currentUser->is($member)) {
            return redirect(type(config('fortify.home'))->asString());
        }

        return back(303);
    }
}

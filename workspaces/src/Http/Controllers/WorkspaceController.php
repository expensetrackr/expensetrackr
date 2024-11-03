<?php

declare(strict_types=1);

namespace Workspaces\Http\Controllers;

use App\Models\User;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;
use Workspaces\Actions\ValidateWorkspaceDeletion;
use Workspaces\Contracts\CreatesWorkspaces;
use Workspaces\Contracts\DeletesWorkspaces;
use Workspaces\Contracts\UpdatesWorkspaceNames;
use Workspaces\RedirectsActions;
use Workspaces\Workspaces;

final class WorkspaceController extends Controller
{
    use RedirectsActions;

    /**
     * Show the workspace management screen.
     */
    public function show(Request $request, int $workspaceId): Response
    {
        $workspace = Workspaces::newWorkspaceModel()->findOrFail($workspaceId);

        Gate::authorize('view', $workspace);

        return Workspaces::inertia()->render($request, 'workspaces/show', [
            'workspace' => $workspace->load('owner', 'users', 'workspaceInvitations'),
            'availableRoles' => array_values(Workspaces::$roles),
            'availablePermissions' => Workspaces::$permissions,
            'defaultPermissions' => Workspaces::$defaultPermissions,
            'permissions' => [
                'canAddWorkspaceMembers' => Gate::check('addWorkspaceMember', $workspace),
                'canDeleteWorkspace' => Gate::check('delete', $workspace),
                'canRemoveWorkspaceMembers' => Gate::check('removeWorkspaceMember', $workspace),
                'canUpdateWorkspace' => Gate::check('update', $workspace),
                'canUpdateWorkspaceMembers' => Gate::check('updateWorkspaceMember', $workspace),
            ],
        ]);
    }

    /**
     * Create a new workspace.
     */
    public function store(Request $request): Application|RedirectResponse|\Illuminate\Http\Response|Redirector|Response
    {
        $creator = app(CreatesWorkspaces::class);

        $creator->create(type($request->user())->as(User::class), $request->all());

        return $this->redirectPath($creator);
    }

    /**
     * Show the workspace creation screen.
     *
     * @return Response
     */
    public function create(Request $request)
    {
        Gate::authorize('create', Workspaces::newWorkspaceModel());

        return Workspaces::inertia()->render($request, 'Workspaces/Create');
    }

    /**
     * Update the given workspaces name.
     */
    public function update(Request $request, int $workspaceId): RedirectResponse
    {
        $workspace = Workspaces::newWorkspaceModel()->findOrFail($workspaceId);

        app(UpdatesWorkspaceNames::class)->update(type($request->user())->as(User::class), $workspace, $request->all());

        return back(303);
    }

    /**
     * Delete the given workspace.
     */
    public function destroy(Request $request, int $workspaceId): Application|RedirectResponse|\Illuminate\Http\Response|Redirector|Response
    {
        $workspace = Workspaces::newWorkspaceModel()->findOrFail($workspaceId);

        app(ValidateWorkspaceDeletion::class)->validate(type($request->user())->as(User::class), $workspace);

        $deleter = app(DeletesWorkspaces::class);

        $deleter->delete($workspace);

        return $this->redirectPath($deleter);
    }
}

<?php

declare(strict_types=1);

namespace Workspaces\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Workspaces\Workspaces;

final class CurrentWorkspaceController extends Controller
{
    /**
     * Update the authenticated user's current workspace.
     */
    public function update(Request $request): RedirectResponse
    {
        $workspace = Workspaces::newWorkspaceModel()->findOrFail($request->workspace_id);

        if (! $request->user()->switchWorkspace($workspace)) {
            abort(403);
        }

        return redirect(config('fortify.home'), 303);
    }
}

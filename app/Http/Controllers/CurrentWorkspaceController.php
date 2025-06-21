<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Workspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class CurrentWorkspaceController extends Controller
{
    /**
     * Update the authenticated user's current workspace.
     */
    public function update(Request $request): RedirectResponse
    {
        $workspace = type(Workspace::findOrFail($request->workspace_id))->as(Workspace::class);

        if (! $request->user()?->switchWorkspace($workspace)) {
            abort(403);
        }

        return redirect(route('dashboard', absolute: false), 303);
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\WorkspaceSettings\UpdateWorkspaceSettings;
use App\Http\Requests\UpdateWorkspaceSettingRequest;
use App\Models\Workspace;
use App\Models\WorkspaceSetting;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;

final class WorkspaceSettingController
{
    use AuthorizesRequests;

    /**
     * Update the given workspaces settings.
     */
    public function update(UpdateWorkspaceSettingRequest $request, Workspace $workspace, WorkspaceSetting $settings, UpdateWorkspaceSettings $action): RedirectResponse
    {
        $this->authorize('update', $workspace);

        $action->update($settings, $request->validated());

        return back(303);
    }
}

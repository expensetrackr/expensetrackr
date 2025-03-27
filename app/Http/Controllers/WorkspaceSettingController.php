<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\WorkspaceSettings\UpdateWorkspaceSettings;
use App\Http\Requests\UpdateWorkspaceSettingRequest;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceSetting;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;

final class WorkspaceSettingController
{
    /**
     * Update the given workspaces settings.
     */
    public function update(
        UpdateWorkspaceSettingRequest $request,
        Workspace $workspace,
        WorkspaceSetting $settings,
        #[CurrentUser]
        User $user,
        UpdateWorkspaceSettings $action,
    ): RedirectResponse {
        if (! $user->subscribed()) {
            return back(303)
                ->with('toast',
                    [
                        'type' => 'error',
                        'title' => __('You need to be subscribed to update this setting.'),
                        'duration' => 10000,
                    ]
                );
        }

        $action->update($settings, $request->validated());

        return back(303);
    }
}

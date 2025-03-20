<?php

declare(strict_types=1);

namespace App\Actions\WorkspaceSettings;

use App\Models\WorkspaceSetting;

final class UpdateWorkspaceSettings
{
    /**
     * Update the given workspace settings.
     *
     * @param  array<string, mixed>  $input
     */
    public function update(WorkspaceSetting $settings, array $data): void
    {
        $settings->update($data);
    }
}

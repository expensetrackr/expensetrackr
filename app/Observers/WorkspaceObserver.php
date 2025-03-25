<?php

declare(strict_types=1);

namespace App\Observers;

use App\Actions\Categories\CreateSystemCategories;
use App\Models\Workspace;

final class WorkspaceObserver
{
    /**
     * Handle the Workspace "created" event.
     */
    public function created(Workspace $workspace): void
    {
        (new CreateSystemCategories())->handle($workspace);
    }
}

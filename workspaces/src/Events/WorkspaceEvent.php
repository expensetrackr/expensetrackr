<?php

declare(strict_types=1);

namespace Workspaces\Events;

use App\Models\Workspace;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

abstract class WorkspaceEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The workspace instance.
     */
    public Workspace $workspace;

    /**
     * Create a new event instance.
     */
    public function __construct(Workspace $workspace)
    {
        $this->workspace = $workspace;
    }
}

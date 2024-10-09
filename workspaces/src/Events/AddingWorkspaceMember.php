<?php

declare(strict_types=1);

namespace Workspaces\Events;

use Illuminate\Foundation\Events\Dispatchable;

final class AddingWorkspaceMember
{
    use Dispatchable;

    /**
     * The workspace instance.
     */
    public mixed $workspace;

    /**
     * The workspace member being added.
     */
    public mixed $user;

    /**
     * Create a new event instance.
     */
    public function __construct(mixed $workspace, mixed $user)
    {
        $this->workspace = $workspace;
        $this->user = $user;
    }
}

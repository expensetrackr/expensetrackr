<?php

declare(strict_types=1);

namespace Workspaces\Events;

use Illuminate\Foundation\Events\Dispatchable;

final class WorkspaceMemberUpdated
{
    use Dispatchable;

    /**
     * The workspace instance.
     */
    public mixed $workspace;

    /**
     * The workspace member that was updated.
     */
    public mixed $user;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(mixed $workspace, mixed $user)
    {
        $this->workspace = $workspace;
        $this->user = $user;
    }
}

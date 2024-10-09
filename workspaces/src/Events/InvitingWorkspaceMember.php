<?php

declare(strict_types=1);

namespace Workspaces\Events;

use Illuminate\Foundation\Events\Dispatchable;

final class InvitingWorkspaceMember
{
    use Dispatchable;

    /**
     * The workspace instance.
     */
    public mixed $workspace;

    /**
     * The email address of the invitee.
     */
    public mixed $email;

    /**
     * The role of the invitee.
     */
    public mixed $role;

    /**
     * Create a new event instance.
     */
    public function __construct(mixed $workspace, mixed $email, mixed $role)
    {
        $this->workspace = $workspace;
        $this->email = $email;
        $this->role = $role;
    }
}

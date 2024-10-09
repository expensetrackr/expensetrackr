<?php

declare(strict_types=1);

namespace Workspaces\Events;

use Illuminate\Foundation\Events\Dispatchable;

final class AddingWorkspace
{
    use Dispatchable;

    /**
     * The workspace owner.
     */
    public mixed $owner;

    /**
     * Create a new event instance.
     */
    public function __construct(mixed $owner)
    {
        $this->owner = $owner;
    }
}

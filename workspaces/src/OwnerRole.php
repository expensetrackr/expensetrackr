<?php

declare(strict_types=1);

namespace Workspaces;

final class OwnerRole extends Role
{
    /**
     * Create a new role instance.
     */
    public function __construct()
    {
        parent::__construct('owner', 'Owner', ['*']);
    }
}

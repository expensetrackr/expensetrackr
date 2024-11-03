<?php

declare(strict_types=1);

namespace Workspaces;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Membership extends Pivot
{
    /**
     * The table associated with the pivot model.
     */
    protected $table = 'workspace_users';
}

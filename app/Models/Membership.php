<?php

declare(strict_types=1);

namespace App\Models;

use Workspaces\Membership as BaseMembership;

final class Membership extends BaseMembership
{
    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;
}

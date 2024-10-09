<?php

declare(strict_types=1);

namespace Workspaces\Contracts;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User;

/**
 * @method void remove(User $user, Model $workspace, User $workspaceMember)
 */
interface RemovesWorkspaceMembers
{
    //
}

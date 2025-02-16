<?php

declare(strict_types=1);

namespace App\Contracts;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User;

/**
 * @method void handle(User $user, Model $workspace, User $workspaceMember)
 */
interface RemovesWorkspaceMembers
{
    //
}

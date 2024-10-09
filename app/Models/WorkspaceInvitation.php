<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\WorkspaceOwned;
use Workspaces\WorkspaceInvitation as BaseWorkspaceInvitation;

final class WorkspaceInvitation extends BaseWorkspaceInvitation
{
    use WorkspaceOwned;

    protected $fillable = [
        'email',
        'role',
    ];
}

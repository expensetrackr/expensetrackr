<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Workspaces\Events\WorkspaceCreated;
use Workspaces\Events\WorkspaceDeleted;
use Workspaces\Events\WorkspaceUpdated;
use Workspaces\Workspace as BaseWorkspace;

final class Workspace extends BaseWorkspace
{
    use HasFactory;

    protected $casts = [
        'personal_workspace' => 'boolean',
    ];

    protected $fillable = [
        'name',
        'personal_workspace',
    ];

    protected $dispatchesEvents = [
        'created' => WorkspaceCreated::class,
        'updated' => WorkspaceUpdated::class,
        'deleted' => WorkspaceDeleted::class,
    ];
}

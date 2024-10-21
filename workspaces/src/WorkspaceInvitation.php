<?php

declare(strict_types=1);

namespace Workspaces;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkspaceInvitation extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'email',
        'role',
    ];

    /**
     * Get the workspace that the invitation belongs to.
     */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspaces::workspaceModel());
    }
}

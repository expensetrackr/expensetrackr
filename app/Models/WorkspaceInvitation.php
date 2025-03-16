<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $workspace_id
 * @property string $email
 * @property string $role
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read Workspace $workspace
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WorkspaceInvitation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WorkspaceInvitation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WorkspaceInvitation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WorkspaceInvitation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WorkspaceInvitation whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WorkspaceInvitation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WorkspaceInvitation whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WorkspaceInvitation whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WorkspaceInvitation whereWorkspaceId($value)
 *
 * @mixin \Eloquent
 */
final class WorkspaceInvitation extends Model
{
    /**
     * Get the workspace that the invitation belongs to.
     *
     * @return BelongsTo<Workspace, $this>
     */
    final public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }
}

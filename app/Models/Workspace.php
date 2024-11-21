<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\WorkspaceFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Workspaces\Events\WorkspaceCreated;
use Workspaces\Events\WorkspaceDeleted;
use Workspaces\Events\WorkspaceUpdated;
use Workspaces\Workspace as BaseWorkspace;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property bool $personal_workspace
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read User|null $owner
 * @property-read \Workspaces\Membership|null $membership
 * @property-read Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @property-read Collection<int, \Workspaces\WorkspaceInvitation> $workspaceInvitations
 * @property-read int|null $workspace_invitations_count
 *
 * @method static \Database\Factories\WorkspaceFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace wherePersonalWorkspace($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace whereUserId($value)
 *
 * @mixin Eloquent
 */
final class Workspace extends BaseWorkspace
{
    /** @use HasFactory<WorkspaceFactory> */
    use HasFactory;

    /**
     * The event map for the model.
     *
     * @var array<string, string>
     */
    protected $dispatchesEvents = [
        'created' => WorkspaceCreated::class,
        'updated' => WorkspaceUpdated::class,
        'deleted' => WorkspaceDeleted::class,
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'personal_workspace' => 'boolean',
        ];
    }
}

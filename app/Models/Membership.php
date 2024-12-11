<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonImmutable;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * @property int $id
 * @property int $workspace_id
 * @property int $user_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read User $user
 * @property-read Workspace $workspace
 *
 * @method static Builder<static>|Membership newModelQuery()
 * @method static Builder<static>|Membership newQuery()
 * @method static Builder<static>|Membership query()
 * @method static Builder<static>|Membership whereCreatedAt($value)
 * @method static Builder<static>|Membership whereId($value)
 * @method static Builder<static>|Membership whereRole($value)
 * @method static Builder<static>|Membership whereUpdatedAt($value)
 * @method static Builder<static>|Membership whereUserId($value)
 * @method static Builder<static>|Membership whereWorkspaceId($value)
 * @method static Builder<static>|Membership permission($permissions, $without = false)
 * @method static Builder<static>|Membership role($roles, $guard = null, $without = false)
 * @method static Builder<static>|Membership withoutPermission($permissions)
 * @method static Builder<static>|Membership withoutRole($roles, $guard = null)
 *
 * @mixin Eloquent
 */
final class Membership extends Pivot
{
    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     * The table associated with the pivot model.
     */
    protected $table = 'workspace_users';

    /**
     * Get the user that owns the membership.
     *
     * @return BelongsTo<User, covariant $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the workspace that owns the membership.
     *
     * @return BelongsTo<Workspace, covariant $this>
     */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class, 'workspace_id');
    }
}

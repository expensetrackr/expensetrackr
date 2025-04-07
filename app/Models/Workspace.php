<?php

declare(strict_types=1);

namespace App\Models;

use App\Events\WorkspaceCreated;
use App\Events\WorkspaceDeleted;
use App\Events\WorkspaceUpdated;
use App\Observers\WorkspaceObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\PrefixedIds\Models\Concerns\HasPrefixedId;

#[ObservedBy(WorkspaceObserver::class)]
/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property bool $personal_workspace
 * @property string $public_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read Collection<int, Category> $categories
 * @property-read int|null $categories_count
 * @property-read string|null $prefixed_id
 * @property-read Collection<int, WorkspaceInvitation> $invitations
 * @property-read int|null $invitations_count
 * @property-read Membership|null $membership
 * @property-read Collection<int, User> $members
 * @property-read int|null $members_count
 * @property-read User|null $owner
 * @property-read WorkspaceSetting|null $settings
 * @property-read Collection<int, Transaction> $transactions
 * @property-read int|null $transactions_count
 *
 * @method static \Database\Factories\WorkspaceFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace wherePersonalWorkspace($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace wherePublicId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Workspace whereUserId($value)
 *
 * @mixin \Eloquent
 */
final class Workspace extends Model
{
    /** @use HasFactory<\Database\Factories\WorkspaceFactory> */
    use HasFactory, HasPrefixedId;

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
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'public_id';
    }

    /**
     * Determine if the given user belongs to the workspace.
     */
    public function hasUser(User $user): bool
    {
        if ($this->members->contains($user)) {
            return true;
        }

        return $user->ownsWorkspace($this);
    }

    /**
     * Determine if the given email address belongs to a user on the workspace.
     */
    public function hasUserWithEmail(string $email): bool
    {
        return $this->allMembers()->contains(fn ($user): bool => $user->email === $email);
    }

    /**
     * Get all the workspaces users including its owner.
     *
     * @return Collection<int, User>
     */
    public function allMembers(): Collection
    {
        return $this->members->merge([type($this->owner)->as(User::class)]);
    }

    /**
     * Get all the pending user invitations for the workspace.
     *
     * @return HasMany<WorkspaceInvitation, covariant $this>
     */
    public function invitations(): HasMany
    {
        return $this->hasMany(WorkspaceInvitation::class);
    }

    /**
     * Remove the given member from the workspace.
     */
    public function removeMember(User $user): void
    {
        if ($user->current_workspace_id === $this->id) {
            $user->forceFill([
                'current_workspace_id' => null,
            ])->save();
        }

        $this->members()->detach($user);
    }

    /**
     * Get all the users that belong to the workspace.
     *
     * @return BelongsToMany<User, covariant $this>
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, Membership::class)
            ->withTimestamps()
            ->as('membership');
    }

    /**
     * Purge all the workspaces resources.
     */
    public function purge(): void
    {
        $this->owner()->where('current_workspace_id', $this->id)
            ->update(['current_workspace_id' => null]);

        $this->members()->where('current_workspace_id', $this->id)
            ->update(['current_workspace_id' => null]);

        $this->members()->detach();

        $this->delete();
    }

    /**
     * Get the owner of the workspace.
     *
     * @return BelongsTo<User, covariant $this>
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the workspace setting for the workspace.
     *
     * @return HasOne<WorkspaceSetting, covariant $this>
     */
    public function settings(): HasOne
    {
        return $this->hasOne(WorkspaceSetting::class, 'workspace_id');
    }

    /**
     * Get all the categories for the workspace.
     *
     * @return HasMany<Category, covariant $this>
     */
    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    /**
     * Get all the transactions for the workspace.
     *
     * @return HasMany<Transaction, covariant $this>
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

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

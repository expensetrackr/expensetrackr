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

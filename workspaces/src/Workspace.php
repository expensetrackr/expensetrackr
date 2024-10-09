<?php

declare(strict_types=1);

namespace Workspaces;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

abstract class Workspace extends Model
{
    /**
     * Determine if the given user belongs to the workspace.
     */
    final public function hasUser(User $user): bool
    {
        return $this->users->contains($user) || $user->ownsWorkspace($this);
    }

    /**
     * Determine if the given email address belongs to a user on the workspace.
     */
    final public function hasUserWithEmail(string $email): bool
    {
        return $this->allUsers()->contains(fn ($user) => $user->email === $email);
    }

    /**
     * Get all the workspaces users including its owner.
     */
    final public function allUsers(): Collection
    {
        return $this->users->merge([$this->owner]);
    }

    /**
     * Determine if the given user has the given permission on the workspace.
     */
    final public function userHasPermission(User $user, string $permission): bool
    {
        return $user->hasWorkspacePermission($this, $permission);
    }

    /**
     * Get all the pending user invitations for the workspace.
     */
    final public function workspaceInvitations(): HasMany
    {
        return $this->hasMany(Workspaces::workspaceInvitationModel());
    }

    /**
     * Remove the given user from the workspace.
     */
    final public function removeUser(User $user): void
    {
        if ($user->current_workspace_id === $this->id) {
            $user->forceFill([
                'current_workspace_id' => null,
            ])->save();
        }

        $this->users()->detach($user);
    }

    /**
     * Get all the users that belong to the workspace.
     */
    final public function users(): BelongsToMany
    {
        return $this->belongsToMany(Workspaces::userModel(), Workspaces::membershipModel())
            ->withPivot('role')
            ->withTimestamps()
            ->as('membership');
    }

    /**
     * Purge all the workspaces resources.
     */
    final public function purge(): void
    {
        $this->owner()->where('current_workspace_id', $this->id)
            ->update(['current_workspace_id' => null]);

        $this->users()->where('current_workspace_id', $this->id)
            ->update(['current_workspace_id' => null]);

        $this->users()->detach();

        $this->delete();
    }

    /**
     * Get the owner of the workspace.
     */
    final public function owner(): BelongsTo
    {
        return $this->belongsTo(Workspaces::userModel(), 'user_id');
    }
}

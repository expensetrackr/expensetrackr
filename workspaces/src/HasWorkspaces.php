<?php

declare(strict_types=1);

namespace Workspaces;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

trait HasWorkspaces
{
    /**
     * Determine if the given workspace is the current workspace.
     */
    public function isCurrentWorkspace(mixed $workspace): bool
    {
        return $workspace->id === $this->currentWorkspace->id;
    }

    /**
     * Get the current workspace of the user's context.
     */
    public function currentWorkspace(): BelongsTo
    {
        if (is_null($this->current_workspace_id) && $this->id) {
            $this->switchWorkspace($this->personalWorkspace());
        }

        return $this->belongsTo(Workspaces::workspaceModel(), 'current_workspace_id');
    }

    /**
     * Switch the user's context to the given workspace.
     */
    public function switchWorkspace(mixed $workspace): bool
    {
        if (! $this->belongsToWorkspace($workspace)) {
            return false;
        }

        $this->forceFill([
            'current_workspace_id' => $workspace->id,
        ])->save();

        $this->setRelation('currentWorkspace', $workspace);

        return true;
    }

    /**
     * Determine if the user belongs to the given workspace.
     */
    public function belongsToWorkspace(mixed $workspace): bool
    {
        if (is_null($workspace)) {
            return false;
        }

        return $this->ownsWorkspace($workspace) || $this->workspaces->contains(fn ($t) => $t->id === $workspace->id);
    }

    /**
     * Determine if the user owns the given workspace.
     */
    public function ownsWorkspace(mixed $workspace): bool
    {
        if (is_null($workspace)) {
            return false;
        }

        return $this->id === $workspace->{$this->getForeignKey()};
    }

    /**
     * Get the user's "personal" workspace.
     */
    public function personalWorkspace(): Workspace
    {
        return $this->ownedWorkspaces->firstWhere('personal_workspace', true);
    }

    /**
     * Get all the workspaces the user owns or belongs to.
     */
    public function allWorkspaces(): Collection
    {
        return $this->ownedWorkspaces->merge($this->workspaces)->sortBy('name');
    }

    /**
     * Get all the workspaces the user owns.
     */
    public function ownedWorkspaces(): HasMany
    {
        return $this->hasMany(Workspaces::workspaceModel());
    }

    /**
     * Get all the workspace the user belongs to.
     */
    public function workspaces(): BelongsToMany
    {
        return $this->belongsToMany(Workspaces::workspaceModel(), Workspaces::membershipModel())
            ->withPivot('role')
            ->withTimestamps()
            ->as('membership');
    }

    /**
     * Determine if the user has the given role on the given workspace.
     */
    public function hasWorkspaceRole(mixed $workspace, string $role): bool
    {
        if ($this->ownsWorkspace($workspace)) {
            return true;
        }

        return $this->belongsToWorkspace($workspace) && optional(Workspaces::findRole($workspace->users->where(
            'id', $this->id
        )->first()->membership->role))->key === $role;
    }

    /**
     * Determine if the user has the given permission on the given workspace.
     */
    public function hasWorkspacePermission(mixed $workspace, string $permission): bool
    {
        if ($this->ownsWorkspace($workspace)) {
            return true;
        }

        if (! $this->belongsToWorkspace($workspace)) {
            return false;
        }

        if (in_array(HasApiTokens::class, class_uses_recursive($this)) &&
            ! $this->tokenCan($permission) &&
            $this->currentAccessToken() !== null) {
            return false;
        }

        $permissions = $this->workspacePermissions($workspace);

        return in_array($permission, $permissions) ||
            in_array('*', $permissions) ||
            (Str::endsWith($permission, ':create') && in_array('*:create', $permissions)) ||
            (Str::endsWith($permission, ':update') && in_array('*:update', $permissions));
    }

    /**
     * Get the user's permissions for the given workspace.
     */
    public function workspacePermissions(mixed $workspace): array
    {
        if ($this->ownsWorkspace($workspace)) {
            return ['*'];
        }

        if (! $this->belongsToWorkspace($workspace)) {
            return [];
        }

        return (array) optional($this->workspaceRole($workspace))->permissions;
    }

    /**
     * Get the role that the user has on the workspace.
     */
    public function workspaceRole(mixed $workspace): Role|OwnerRole|null
    {
        if ($this->ownsWorkspace($workspace)) {
            return new OwnerRole;
        }

        if (! $this->belongsToWorkspace($workspace)) {
            return null;
        }

        $role = $workspace->users
            ->where('id', $this->id)
            ->first()
            ->membership
            ->role;

        return $role ? Workspaces::findRole($role) : null;
    }
}

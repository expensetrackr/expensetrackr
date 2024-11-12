<?php

declare(strict_types=1);

namespace Workspaces;

use App\Models\User;
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
    public function isCurrentWorkspace(Workspace $workspace): bool
    {
        return $workspace->id === $this->currentWorkspace?->id;
    }

    /**
     * Get the current workspace of the user's context.
     *
     * @return BelongsTo<Workspace, covariant $this>
     */
    public function currentWorkspace(): BelongsTo
    {
        if (is_null($this->current_workspace_id) && $this->id) {
            $this->switchWorkspace($this->personalWorkspace());
        }

        return $this->belongsTo(Workspace::class, 'current_workspace_id');
    }

    /**
     * Switch the user's context to the given workspace.
     */
    public function switchWorkspace(Workspace $workspace): bool
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
    public function belongsToWorkspace(?Workspace $workspace): bool
    {
        if (is_null($workspace)) {
            return false;
        }

        return $this->ownsWorkspace($workspace) || $this->workspaces->contains(fn ($t) => $t->id === $workspace->id);
    }

    /**
     * Determine if the user owns the given workspace.
     */
    public function ownsWorkspace(?Workspace $workspace): bool
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
        return type($this->ownedWorkspaces->firstWhere('personal_workspace', true))->as(Workspace::class);
    }

    /**
     * Get all the workspaces the user owns or belongs to.
     *
     * @return Collection<int, Workspace>
     */
    public function allWorkspaces(): Collection
    {
        return $this->ownedWorkspaces->merge($this->workspaces)->sortBy('name');
    }

    /**
     * Get all the workspaces the user owns.
     *
     * @return HasMany<Workspace, covariant $this>
     */
    public function ownedWorkspaces(): HasMany
    {
        return $this->hasMany(Workspace::class);
    }

    /**
     * Get all the workspace the user belongs to.
     *
     * @return BelongsToMany<Workspace, covariant $this>
     */
    public function workspaces(): BelongsToMany
    {
        return $this->belongsToMany(Workspace::class, Membership::class)
            ->withPivot('role')
            ->withTimestamps()
            ->as('membership');
    }

    /**
     * Determine if the user has the given role on the given workspace.
     */
    public function hasWorkspaceRole(Workspace $workspace, string $role): bool
    {
        if ($this->ownsWorkspace($workspace)) {
            return true;
        }

        return $this->belongsToWorkspace($workspace) && Workspaces::findRole(type($workspace->users->firstWhere(
            'id',
            $this->id
        )?->membership?->role)->asString())?->key === $role;
    }

    /**
     * Determine if the user has the given permission on the given workspace.
     */
    public function hasWorkspacePermission(Workspace $workspace, string $permission): bool
    {
        if ($this->ownsWorkspace($workspace)) {
            return true;
        }

        if (! $this->belongsToWorkspace($workspace)) {
            return false;
        }

        if (
            in_array(HasApiTokens::class, class_uses_recursive($this)) &&
            ! $this->tokenCan($permission)
        ) {
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
     *
     * @return array<string>
     */
    public function workspacePermissions(Workspace $workspace): array
    {
        if ($this->ownsWorkspace($workspace)) {
            return ['*'];
        }

        if (! $this->belongsToWorkspace($workspace)) {
            return [];
        }

        return $this->workspaceRole($workspace)->permissions ?? [];
    }

    /**
     * Get the role that the user has on the workspace.
     */
    public function workspaceRole(Workspace $workspace): Role|OwnerRole|null
    {
        if ($this->ownsWorkspace($workspace)) {
            return new OwnerRole;
        }

        if (! $this->belongsToWorkspace($workspace)) {
            return null;
        }

        $role = $workspace->users->firstWhere('id', $this->id)?->membership?->role;

        return $role ? Workspaces::findRole($role) : null;
    }
}

<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Models\Membership;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Collection;

trait HasWorkspaces
{
    /**
     * Determine if the given workspace is the current workspace.
     */
    public function isCurrentWorkspace(Workspace $workspace): bool
    {
        return $workspace->is($this->currentWorkspace);
    }

    /**
     * Get the current workspace of the user's context.
     *
     * @return BelongsTo<Workspace, covariant $this>
     */
    public function currentWorkspace(): BelongsTo
    {
        if (! $this->current_workspace_id && $this->id) {
            $this->switchWorkspace($this->personalWorkspace());
        }

        return $this->belongsTo(Workspace::class, 'current_workspace_id');
    }

    /**
     * Switch the user's context to the given workspace.
     */
    public function switchWorkspace(?Workspace $workspace): bool
    {
        if (! $workspace instanceof Workspace || ! $this->belongsToWorkspace($workspace)) {
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
        if (! $workspace instanceof Workspace) {
            return false;
        }

        if ($this->ownsWorkspace($workspace)) {
            return true;
        }

        return (bool) $this->workspaces->contains(fn ($t): bool => $t->id === $workspace->id);
    }

    /**
     * Determine if the user owns the given workspace.
     */
    public function ownsWorkspace(?Workspace $workspace): bool
    {
        if (! $workspace instanceof Workspace) {
            return false;
        }

        return $this->id === $workspace->{$this->getForeignKey()};
    }

    /**
     * Get the user's "personal" workspace.
     */
    public function personalWorkspace(): ?Workspace
    {
        return $this->ownedWorkspaces->firstWhere('personal_workspace', true);
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
     * @return BelongsToMany<Workspace, covariant $this, Pivot, 'membership'>
     */
    public function workspaces(): BelongsToMany
    {
        return $this->belongsToMany(Workspace::class, Membership::class)
            ->withTimestamps()
            ->as('membership');
    }
}

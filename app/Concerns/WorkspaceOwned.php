<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Models\Workspace;
use App\Scopes\CurrentWorkspaceScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\Log;

trait WorkspaceOwned
{
    public static function bootWorkspaceOwned(): void
    {
        static::creating(static function ($model): void {
            if ($model instanceof Model && property_exists($model, 'workspace_id') && empty($model->workspace_id)) {
                if (Auth::check() && Context::has('currentWorkspace')) {
                    $model->workspace_id = Context::get('currentWorkspace');
                } else {
                    Log::info('WorkspaceOwned trait: No workspace_id set on model '.$model::class.' '.($model->id ?? 'N/A')); // @phpstan-ignore-line binaryOp.invalid

                    throw new ModelNotFoundException('WorkspaceOwned trait: No workspace_id set on model '.$model::class.' '.($model->id ?? 'N/A')); // @phpstan-ignore-line binaryOp.invalid
                }
            }
        });

        static::addGlobalScope(new CurrentWorkspaceScope);
    }

    /**
     * Get the workspace that the model belongs to.
     *
     * @return BelongsTo<Workspace, covariant $this>
     */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class, 'workspace_id');
    }
}

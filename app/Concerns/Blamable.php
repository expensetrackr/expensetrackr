<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

trait Blamable
{
    public static function bootBlamable(): void
    {
        static::creating(static function ($model): void {
            if (Auth::check() && $authId = Auth::id()) {
                $model->created_by ??= $authId;
                $model->updated_by ??= $authId;
            }
        });

        static::updating(static function ($model): void {
            if (Auth::check() && $authId = Auth::id()) {
                $model->updated_by = $authId;
            }
        });
    }

    /**
     * Get the user that created the model.
     *
     * @return BelongsTo<User, covariant $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user that updated the model.
     *
     * @return BelongsTo<User, covariant $this>
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}

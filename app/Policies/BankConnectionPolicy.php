<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\BankConnection;
use App\Models\User;

final class BankConnectionPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, BankConnection $bankConnection): bool
    {
        return $user->currentWorkspace->is($bankConnection->workspace);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        if ($user->is_admin || $user->subscribed('business') || $user->subscribed('enterprise')) {
            return true;
        }

        if ($user->subscribed('personal')) {
            return $user->accounts()->count() < 1;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, BankConnection $bankConnection): bool
    {
        return $user->currentWorkspace->is($bankConnection->workspace);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, BankConnection $bankConnection): bool
    {
        return $user->currentWorkspace->is($bankConnection->workspace);
    }
}

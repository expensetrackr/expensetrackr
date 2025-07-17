<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Account;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Log;

final class AccountPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        Log::error($user);

        return $user->currentWorkspace?->accounts()->exists() ?? false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Account $account): bool
    {
        return $account->workspace->is($user->currentWorkspace);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        if ($user->is_admin || $user->subscribed('enterprise')) {
            return true;
        }

        if ($user->subscribed('personal')) {
            return $user->accounts()->count() < 3;
        }

        if ($user->subscribed('business')) {
            return $user->accounts()->count() < 10;
        }

        return $user->accounts()->count() < 1;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Account $account): bool
    {
        return $account->workspace->is($user->currentWorkspace) && $account->createdBy?->is($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Account $account): bool
    {
        return $account->workspace->is($user->currentWorkspace) && $account->createdBy?->is($user);
    }
}

<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\ConnectedAccount;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

final class ConnectedAccountPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ConnectedAccount $connectedAccount): bool
    {
        return $user->ownsConnectedAccount($connectedAccount);
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
    public function update(User $user, ConnectedAccount $connectedAccount): bool
    {
        return $user->ownsConnectedAccount($connectedAccount);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ConnectedAccount $connectedAccount): bool
    {
        return $user->ownsConnectedAccount($connectedAccount);
    }
}

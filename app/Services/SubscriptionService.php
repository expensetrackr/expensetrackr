<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;

final class SubscriptionService
{
    /**
     * Get the maximum number of accounts allowed for a user based on their subscription.
     */
    public static function getMaxAccountsForUser(User $user): int
    {
        $defaultLimits = config('accounts.limits', [
            'free' => 1,
            'personal' => 5,
            'business' => 10,
            'enterprise' => 999,
        ]);

        $limits = config('accounts.limits', $defaultLimits);
        $tier = self::detectSubscriptionTier($user);

        return $limits[$tier];
    }

    /**
     * Check if a user can create additional accounts.
     */
    public static function canCreateMoreAccounts(User $user, int $currentAccountCount): bool
    {
        $maxAccounts = self::getMaxAccountsForUser($user);

        return $currentAccountCount < $maxAccounts;
    }

    /**
     * Get the number of additional accounts a user can create.
     */
    public static function getRemainingAccountSlots(User $user, int $currentAccountCount): int
    {
        $maxAccounts = self::getMaxAccountsForUser($user);

        return max(0, $maxAccounts - $currentAccountCount);
    }

    /**
     * Get the subscription tier name for a user.
     */
    public static function getSubscriptionTier(User $user): string
    {
        return self::detectSubscriptionTier($user);
    }

    /**
     * Detect the subscription tier for a user.
     */
    private static function detectSubscriptionTier(User $user): string
    {
        if ($user->is_admin || $user->subscribed('enterprise')) {
            return 'enterprise';
        }

        if ($user->subscribed('business')) {
            return 'business';
        }

        if ($user->subscribed('personal')) {
            return 'personal';
        }

        return 'free';
    }
}

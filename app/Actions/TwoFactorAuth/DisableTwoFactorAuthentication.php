<?php

declare(strict_types=1);

namespace App\Actions\TwoFactorAuth;

use App\Models\User;
use Illuminate\Support\Facades\Log;

final class DisableTwoFactorAuthentication
{
    /**
     * Disable two factor authentication for the user.
     */
    public function __invoke(User $user): void
    {
        if ($user->two_factor_secret !== null ||
            $user->two_factor_recovery_codes !== null ||
            $user->two_factor_confirmed_at !== null) {
            $user->forceFill([
                'two_factor_secret' => null,
                'two_factor_recovery_codes' => null,
                'two_factor_confirmed_at' => null,
            ])->save();

            Log::info('User disabled two factor authentication.', [
                'user_id' => $user->id,
            ]);
        }
    }
}

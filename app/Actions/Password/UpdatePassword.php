<?php

declare(strict_types=1);

namespace App\Actions\Password;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

final class UpdatePassword
{
    /**
     * Update the user's password.
     *
     * @param  array{ current_password: string, password: string, password_confirmation: string }  $input
     */
    public function handle(User $user, array $input): void
    {
        $user->update([
            'password' => Hash::make($input['password']),
        ]);
    }
}

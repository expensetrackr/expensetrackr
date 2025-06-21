<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\Models\User;
use Illuminate\Http\UploadedFile;

final class UpdateUser
{
    /**
     * Validate and update the given user's profile information.
     *
     * @param  array{ name?: string, email?: string, photo?: UploadedFile|null }  $input
     */
    public function handle(User $user, array $input): void
    {
        if (isset($input['photo'])) {
            $user->updateProfilePhoto($input['photo']);
        }

        if (isset($input['email']) && $input['email'] !== $user->email) {
            $this->updateVerifiedUser($user, $input);
        } else {
            $user->forceFill([
                'name' => $input['name'] ?? $user->name,
                'email' => $input['email'] ?? $user->email,
            ])->save();
        }
    }

    /**
     * Update the given verified user's profile information.
     *
     * @param  array{ name?: string, email: string }  $input
     */
    private function updateVerifiedUser(User $user, array $input): void
    {
        $user->forceFill([
            'name' => $input['name'] ?? $user->name,
            'email' => $input['email'],
            'email_verified_at' => null,
        ])->save();

        $user->sendEmailVerificationNotification();
    }
}

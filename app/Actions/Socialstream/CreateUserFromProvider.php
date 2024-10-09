<?php

declare(strict_types=1);

namespace App\Actions\Socialstream;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use JoelButcher\Socialstream\Contracts\CreatesConnectedAccounts;
use JoelButcher\Socialstream\Contracts\CreatesUserFromProvider;
use JoelButcher\Socialstream\Socialstream;
use Laravel\Socialite\Contracts\User as ProviderUserContract;

final class CreateUserFromProvider implements CreatesUserFromProvider
{
    /**
     * Create a new action instance.
     */
    public function __construct(
        /**
         * The creates connected accounts instance.
         */
        public CreatesConnectedAccounts $createsConnectedAccounts
    ) {}

    /**
     * Create a new user from a social provider user.
     */
    public function create(string $provider, ProviderUserContract $providerUser): User
    {
        return DB::transaction(fn () => tap(User::create([
            'name' => $providerUser->getName(),
            'email' => $providerUser->getEmail(),
        ]), function (User $user) use ($provider, $providerUser): void {
            $user->markEmailAsVerified();

            if (Socialstream::hasProviderAvatarsFeature() && $providerUser->getAvatar()) {
                $user->setProfilePhotoFromUrl($providerUser->getAvatar());
            }

            $this->createsConnectedAccounts->create($user, $provider, $providerUser);
        }));
    }
}

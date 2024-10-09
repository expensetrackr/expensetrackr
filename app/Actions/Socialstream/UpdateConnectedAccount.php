<?php

declare(strict_types=1);

namespace App\Actions\Socialstream;

use Illuminate\Support\Facades\Gate;
use JoelButcher\Socialstream\ConnectedAccount;
use JoelButcher\Socialstream\Contracts\UpdatesConnectedAccounts;
use JoelButcher\Socialstream\Socialstream;
use Laravel\Socialite\Contracts\User;

final class UpdateConnectedAccount implements UpdatesConnectedAccounts
{
    /**
     * Update a given connected account.
     */
    public function update(mixed $user, ConnectedAccount $connectedAccount, string $provider, User $providerUser): ConnectedAccount
    {
        Gate::forUser($user)->authorize('update', $connectedAccount);

        $connectedAccount->forceFill([
            'provider' => mb_strtolower($provider),
            'provider_id' => $providerUser->getId(),
            'name' => $providerUser->getName(),
            'nickname' => $providerUser->getNickname(),
            'email' => $providerUser->getEmail(),
            'avatar_path' => $providerUser->getAvatar(),
            'token' => $providerUser->token,
            'secret' => $providerUser->tokenSecret ?? null,
            'refresh_token' => $providerUser->refreshToken ?? null,
            'expires_at' => property_exists($providerUser, 'expiresIn') ? now()->addSeconds($providerUser->expiresIn) : null,
        ])->save();

        return $connectedAccount;
    }

    /**
     * Update the refresh token for the given account.
     */
    public function updateRefreshToken(ConnectedAccount $connectedAccount): ConnectedAccount
    {
        $refreshedCredentials = Socialstream::refreshConnectedAccountToken(
            $connectedAccount,
        );

        $connectedAccount->forceFill([
            'token' => $refreshedCredentials->getToken(),
            'secret' => $refreshedCredentials->getTokenSecret(),
            'refresh_token' => $refreshedCredentials->getRefreshToken(),
            'expires_at' => $refreshedCredentials->getExpiry(),
        ])->save();

        return $connectedAccount;
    }
}

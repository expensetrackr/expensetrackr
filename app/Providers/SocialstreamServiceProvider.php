<?php

declare(strict_types=1);

namespace App\Providers;

use App\Actions\Socialstream\CreateConnectedAccount;
use App\Actions\Socialstream\CreateUserWithWorkspacesFromProvider;
use App\Actions\Socialstream\GenerateRedirectForProvider;
use App\Actions\Socialstream\HandleInvalidState;
use App\Actions\Socialstream\ResolveSocialiteUser;
use App\Actions\Socialstream\SetUserPassword;
use App\Actions\Socialstream\UpdateConnectedAccount;
use Illuminate\Support\ServiceProvider;
use JoelButcher\Socialstream\Socialstream;

final class SocialstreamServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Socialstream::createConnectedAccountsUsing(CreateConnectedAccount::class);
        Socialstream::createUsersFromProviderUsing(CreateUserWithWorkspacesFromProvider::class);
        Socialstream::generatesProvidersRedirectsUsing(GenerateRedirectForProvider::class);
        Socialstream::handlesInvalidStateUsing(HandleInvalidState::class);
        Socialstream::resolvesSocialiteUsersUsing(ResolveSocialiteUser::class);
        Socialstream::setUserPasswordsUsing(SetUserPassword::class);
        Socialstream::updateConnectedAccountsUsing(UpdateConnectedAccount::class);
    }
}

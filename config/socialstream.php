<?php

declare(strict_types=1);

use JoelButcher\Socialstream\Features;
use JoelButcher\Socialstream\Providers;

return [
    'middleware' => ['web'],
    'prompt' => 'or',
    'providers' => [
        Providers::google(label: 'Continue with Google'),
    ],
    'features' => [
        Features::rememberSession(),
        Features::refreshOAuthTokens(),
        Features::providerAvatars(),
        Features::createAccountOnFirstLogin(),
        Features::generateMissingEmails(),
        Features::authExistingUnlinkedUsers(),
    ],
    'home' => '/dashboard',
    'redirects' => [
        'login' => '/dashboard',
        'register' => '/dashboard',
        'login-failed' => '/login',
        'registration-failed' => '/register',
        'provider-linked' => '/user/profile',
        'provider-link-failed' => '/user/profile',
    ],
];

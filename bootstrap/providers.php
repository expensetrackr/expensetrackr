<?php

declare(strict_types=1);

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\FortifyServiceProvider::class,
    App\Providers\SocialstreamServiceProvider::class,
    Workspaces\WorkspacesServiceProvider::class,
    App\Providers\WorkspacesServiceProvider::class,
    App\Providers\CurrencyServiceProvider::class,
];

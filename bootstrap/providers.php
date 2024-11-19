<?php

declare(strict_types=1);

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\FortifyServiceProvider::class,
    App\Providers\CurrencyServiceProvider::class,
    App\Providers\MacroServiceProvider::class,
    App\Providers\PrefixedIdsServiceProvider::class,
    App\Providers\SocialstreamServiceProvider::class,
    App\Providers\WorkspacesServiceProvider::class,
    Workspaces\WorkspacesServiceProvider::class,
];

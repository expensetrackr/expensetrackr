<?php

declare(strict_types=1);

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\BankSyncServiceProvider::class,
    App\Providers\CurrencyServiceProvider::class,
    App\Providers\EventServiceProvider::class,
    App\Providers\FortifyServiceProvider::class,
    App\Providers\JsonResourceProvider::class,
    App\Providers\MacroServiceProvider::class,
    App\Providers\PrefixedIdsServiceProvider::class,
    App\Providers\SocialstreamServiceProvider::class,
    App\Providers\TellerCertificatesServiceProvider::class,
    NunoMaduro\Essentials\EssentialsServiceProvider::class,
    Spatie\WebhookClient\WebhookClientServiceProvider::class,
];

<?php

declare(strict_types=1);

namespace App\Providers;

use App\Services\CurrencyService;
use GuzzleHttp\Client;
use Illuminate\Support\ServiceProvider;

final class CurrencyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(CurrencyService::class, fn (): CurrencyService => new CurrencyService(config()->string('services.currency_api.key'), config()->string('services.currency_api.base_url'), app()->make(Client::class)));
    }
}

<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\CurrencyHandler;
use App\Services\CurrencyService;
use GuzzleHttp\Client;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;

final class CurrencyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CurrencyHandler::class, function (Application $app): CurrencyService {
            $apiKey = config('services.currency_api.key');
            $baseUrl = config('services.currency_api.base_url');
            $client = $app->make(Client::class);

            return new CurrencyService($apiKey, $baseUrl, $client);
        });
    }
}

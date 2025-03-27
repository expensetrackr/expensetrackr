<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\CurrencyHandler;
use App\Services\CurrencyService;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;

final class CurrencyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CurrencyHandler::class, fn (Application $app) => new CurrencyService());
    }

    public function boot(): void
    {
        //
    }
}

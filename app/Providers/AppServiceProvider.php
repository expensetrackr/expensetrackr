<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Resend;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(60)->by($request->user()?->id ?: $request->ip()));

        // @phpstan-ignore offsetAccess.nonOffsetAccessible, property.nonObject, method.nonObject
        $this->app['request']->server->set('HTTPS', 'on');

        $this->app->singleton(Resend\Client::class, fn ($app) => Resend::client(type(config('services.resend.key'))->asString()));
    }
}

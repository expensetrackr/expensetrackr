<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\BalanceUpdateInterface;
use App\Models\User;
use App\Services\BalanceUpdateService;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
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
        $this->app->bind(BalanceUpdateInterface::class, BalanceUpdateService::class);
    }

    public function boot(): void
    {
        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(60)->by($request->user()?->id ?: $request->ip()));

        // @phpstan-ignore offsetAccess.nonOffsetAccessible, property.nonObject, method.nonObject
        $this->app['request']->server->set('HTTPS', 'on');

        $this->app->singleton(Resend\Client::class, fn ($app): Resend\Client => Resend::client(type(config('services.resend.key'))->asString()));

        Gate::define('viewPulse', fn (User $user): bool => $user->is_admin);
    }
}

<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\User;
use Illuminate\Auth\Events\Authenticated;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Sentry\Laravel\Integration;
use Sentry\State\Scope;

final class SentryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Event::listen(function (Authenticated $event): void {
            /** @var User $user */
            $user = $event->user;

            Integration::configureScope(static function (Scope $scope) use ($user): void {
                $scope->setUser([
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ]);
            });
        });

        Event::listen(function (Logout $event): void {
            Integration::configureScope(static function (Scope $scope): void {
                $scope->removeUser();
            });
        });
    }
}

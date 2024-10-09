<?php

declare(strict_types=1);

namespace Workspaces;

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Laravel\Fortify\Events\PasswordUpdatedViaController;
use Laravel\Fortify\Fortify;
use Workspaces\Http\Middleware\ShareInertiaData;

final class WorkspacesServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../config/workspaces.php', 'workspaces');
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Fortify::viewPrefix('auth.');

        $this->configurePublishing();
        $this->configureRoutes();

        RedirectResponse::macro('banner', function ($message) {
            /** @var RedirectResponse $this */
            return $this->with('flash', [
                'bannerStyle' => 'success',
                'banner' => $message,
            ]);
        });

        RedirectResponse::macro('warningBanner', function ($message) {
            /** @var RedirectResponse $this */
            return $this->with('flash', [
                'bannerStyle' => 'warning',
                'banner' => $message,
            ]);
        });

        RedirectResponse::macro('dangerBanner', function ($message) {
            /** @var RedirectResponse $this */
            return $this->with('flash', [
                'bannerStyle' => 'danger',
                'banner' => $message,
            ]);
        });

        $this->bootInertia();
    }

    /**
     * Configure publishing for the package.
     */
    protected function configurePublishing(): void
    {
        if (! $this->app->runningInConsole()) {
            return;
        }

        $this->publishes([
            __DIR__.'/../stubs/config/workspaces.php' => config_path('workspaces.php'),
        ], 'workspaces-config');

        $this->publishes([
            __DIR__.'/../database/migrations/0001_01_01_000000_create_users_table.php' => database_path('migrations/0001_01_01_000000_create_users_table.php'),
        ], 'workspaces-migrations');

        $this->publishesMigrations([
            __DIR__.'/../database/migrations/2020_05_21_100000_create_workspaces_table.php' => database_path('migrations/2020_05_21_100000_create_workspaces_table.php'),
            __DIR__.'/../database/migrations/2020_05_21_200000_create_workspace_user_table.php' => database_path('migrations/2020_05_21_200000_create_workspace_user_table.php'),
            __DIR__.'/../database/migrations/2020_05_21_300000_create_workspace_invitations_table.php' => database_path('migrations/2020_05_21_300000_create_workspace_invitations_table.php'),
        ], 'workspaces-workspace-migrations');

        $this->publishes([
            __DIR__.'/../routes/workspaces.php' => base_path('routes/workspaces.php'),
        ], 'workspaces-routes');

        $this->publishes([
            __DIR__.'/../stubs/inertia/resources/js/Pages/Auth' => resource_path('js/Pages/Auth'),
            __DIR__.'/../stubs/inertia/resources/js/Components/AuthenticationCard.vue' => resource_path('js/Components/AuthenticationCard.vue'),
            __DIR__.'/../stubs/inertia/resources/js/Components/AuthenticationCardLogo.vue' => resource_path('js/Components/AuthenticationCardLogo.vue'),
            __DIR__.'/../stubs/inertia/resources/js/Components/Checkbox.vue' => resource_path('js/Components/Checkbox.vue'),
        ], 'workspaces-inertia-auth-pages');
    }

    /**
     * Configure the routes offered by the application.
     */
    protected function configureRoutes(): void
    {
        if (Workspaces::$registersRoutes) {
            Route::group([
                'namespace' => 'Laravel\Workspaces\Http\Controllers',
                'domain' => config('workspaces.domain', null),
                'prefix' => config('workspaces.prefix', config('workspaces.path')),
            ], function () {
                $this->loadRoutesFrom(__DIR__.'/../routes/workspaces.php');
            });
        }
    }

    /**
     * Boot any Inertia related services.
     */
    protected function bootInertia(): void
    {
        $kernel = $this->app->make(Kernel::class);

        $kernel->appendMiddlewareToGroup('web', ShareInertiaData::class);
        $kernel->appendToMiddlewarePriority(ShareInertiaData::class);

        if (class_exists(HandleInertiaRequests::class)) {
            $kernel->appendToMiddlewarePriority(HandleInertiaRequests::class);
        }

        Event::listen(function (PasswordUpdatedViaController $event) {
            if (request()->hasSession()) {
                request()->session()->put(['password_hash_sanctum' => Auth::user()->getAuthPassword()]);
            }
        });

        Fortify::loginView(function () {
            return Inertia::render('auth/login', [
                'canResetPassword' => Route::has('password.request'),
                'status' => session('status'),
            ]);
        });

        Fortify::requestPasswordResetLinkView(function () {
            return Inertia::render('auth/forgot-password', [
                'status' => session('status'),
            ]);
        });

        Fortify::resetPasswordView(function (Request $request) {
            return Inertia::render('auth/reset-password', [
                'email' => $request->input('email'),
                'token' => $request->route('token'),
            ]);
        });

        Fortify::registerView(function () {
            return Inertia::render('auth/register');
        });

        Fortify::verifyEmailView(function () {
            return Inertia::render('auth/verify-email', [
                'status' => session('status'),
            ]);
        });

        Fortify::twoFactorChallengeView(function () {
            return Inertia::render('auth/two-factor-challenge');
        });

        Fortify::confirmPasswordView(function () {
            return Inertia::render('auth/confirm-password');
        });
    }
}

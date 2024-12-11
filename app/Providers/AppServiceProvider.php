<?php

declare(strict_types=1);

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Routing\UrlGenerator;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

final class AppServiceProvider extends ServiceProvider
{
    public function boot(UrlGenerator $url): void
    {
        $this->configureCommands();
        $this->configureModels();
        $this->configurePasswordValidation();
        $this->configureDates();
        $this->configureVite();
        $this->configurePermissions();

        if (config('app.env') !== 'local') {
            $url->forceScheme('https');
        }
    }

    /**
     * Configure the application's commands.
     */
    private function configureCommands(): void
    {
        DB::prohibitDestructiveCommands(
            app()->isProduction()
        );
    }

    /**
     * Configure the models.
     */
    private function configureModels(): void
    {
        Model::shouldBeStrict(! app()->isProduction());
        Model::unguard();
    }

    /**
     * Configure the password validation rules.
     */
    private function configurePasswordValidation(): void
    {
        Password::defaults(fn () => app()->isProduction() ? Password::min(8)->uncompromised() : null);
    }

    /**
     * Configure the dates.
     */
    private function configureDates(): void
    {
        Date::use(CarbonImmutable::class);
    }

    /**
     * Configure Vite for the application.
     */
    private function configureVite(): void
    {
        Vite::prefetch(concurrency: 3);
    }

    /**
     * Configure the Workspaces middleware to run before SubstituteBindings.
     *
     * The Workspaces middleware needs to run before SubstituteBindings because it
     * SubstituteBindings to resolve the route bindings.
     */
    private function configurePermissions(): void
    {
        //        /** @var Kernel $kernel */
        //        $kernel = app()->make(Kernel::class);

        //        $kernel->addToMiddlewarePriorityBefore(
        //            SubstituteBindings::class,
        //            WorkspacesPermission::class,
        //        );
    }
}

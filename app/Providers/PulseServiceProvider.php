<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

final class PulseServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Register the Pulse gate.
     *
     * This gate determines who can access Pulse in non-local environments.
     */
    protected function gate(): void
    {
        Gate::define('viewPulse', fn (User $user): bool => $user->is_admin);
    }
}

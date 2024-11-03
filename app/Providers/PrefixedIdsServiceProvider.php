<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Account;
use Illuminate\Support\ServiceProvider;
use Spatie\PrefixedIds\PrefixedIds;

final class PrefixedIdsServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        PrefixedIds::registerModels([
            'acc_' => Account::class,
        ]);
    }
}

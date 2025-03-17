<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Account;
use App\Models\BankConnection;
use App\Models\Category;
use App\Models\Transaction;
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
            'bconn_' => BankConnection::class,
            'txn_' => Transaction::class,
            'cat_' => Category::class,
        ]);
    }
}

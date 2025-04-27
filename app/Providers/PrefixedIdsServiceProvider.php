<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Account;
use App\Models\BankConnection;
use App\Models\Category;
use App\Models\Changelog;
use App\Models\Merchant;
use App\Models\Transaction;
use App\Models\Workspace;
use App\Models\WorkspaceSetting;
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
            'acct_' => Account::class,
            'bnc_' => BankConnection::class,
            'cat_' => Category::class,
            'chg_' => Changelog::class,
            'mch_' => Merchant::class,
            'txn_' => Transaction::class,
            'ws_' => Workspace::class,
            'wss_' => WorkspaceSetting::class,
        ]);
    }
}

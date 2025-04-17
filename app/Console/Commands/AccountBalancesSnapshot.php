<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Actions\AccountBalances\SnapshotBalanceAction;
use App\Models\Account;
use Illuminate\Console\Command;

final class AccountBalancesSnapshot extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'account-balances:snapshot';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Snapshot the balances of all accounts';

    /**
     * Execute the console command.
     */
    public function handle(SnapshotBalanceAction $action): void
    {
        $this->info('Snapshotting balances of all accounts...');

        Account::query()->chunk(1000, function ($accounts) use ($action): void {
            foreach ($accounts as $account) {
                $action->handle($account);
            }
        });

        $this->info('Balances snapshotting completed');
    }
}

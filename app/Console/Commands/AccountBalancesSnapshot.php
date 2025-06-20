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
     * Create a new console command instance.
     */
    public function __construct(private readonly SnapshotBalanceAction $action)
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $this->info('Snapshotting balances of all accounts...');

        Account::query()->chunk(1000, function ($accounts): void {
            $this->action->handle($accounts);
        });

        $this->info('Balances snapshotting completed');
    }
}

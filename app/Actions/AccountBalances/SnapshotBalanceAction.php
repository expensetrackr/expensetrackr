<?php

declare(strict_types=1);

namespace App\Actions\AccountBalances;

use App\Models\Account;
use App\Models\AccountBalance;
use Illuminate\Database\Eloquent\Collection;

final class SnapshotBalanceAction
{
    /**
     * Snapshot the balance of an account.
     *
     * @param  Collection<int, Account>  $accounts
     */
    public function handle(Collection $accounts): void
    {
        $now = now()->startOfDay();

        $balances = $accounts->map(fn ($account): array => [
            'balance' => $account->current_balance,
            'dated_at' => $now,
            'account_id' => $account->id,
            'workspace_id' => $account->workspace_id,
        ])->all();

        AccountBalance::insert($balances);
    }
}

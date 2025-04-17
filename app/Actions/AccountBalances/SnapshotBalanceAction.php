<?php

declare(strict_types=1);

namespace App\Actions\AccountBalances;

use App\Models\Account;
use App\Models\AccountBalance;

final class SnapshotBalanceAction
{
    /**
     * Snapshot the balance of an account.
     */
    public function handle(Account $account): void
    {
        AccountBalance::insert([
            'balance' => $account->current_balance,
            'dated_at' => now()->startOfDay(),
            'account_id' => $account->id,
            'workspace_id' => $account->workspace_id,
        ]);
    }
}

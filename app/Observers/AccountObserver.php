<?php

declare(strict_types=1);

namespace App\Observers;

use App\Actions\AccountBalances\SnapshotBalanceAction;
use App\Models\Account;

final class AccountObserver
{
    /**
     * Handle the Account "created" event.
     */
    public function created(Account $account, SnapshotBalanceAction $action): void
    {
        $action->handle($account);
    }
}

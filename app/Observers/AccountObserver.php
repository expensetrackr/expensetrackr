<?php

declare(strict_types=1);

namespace App\Observers;

use App\Actions\AccountBalances\SnapshotBalanceAction;
use App\Models\Account;

final readonly class AccountObserver
{
    /**
     * Create a new observer instance.
     */
    public function __construct(private SnapshotBalanceAction $action) {}

    /**
     * Handle the Account "created" event.
     */
    public function created(Account $account): void
    {
        $this->action->handle($account);
    }
}

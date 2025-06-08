<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Models\Transaction;

interface BalanceUpdateInterface
{
    /**
     * Update account balances for both standard and multicurrency accounts.
     */
    public function updateBalances(Transaction $transaction, bool $isReversing = false): void;
}

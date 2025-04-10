<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Data\Finance\BalanceData;
use App\Data\Finance\BankAccountData;
use App\Data\Finance\TransactionData;
use Illuminate\Support\Collection;

interface ProviderHandler
{
    /**
     * List all accounts for the authenticated user.
     *
     * @return Collection<int, AccountData>
     */
    public function getAccounts(): Collection;

    /**
     * Get a single account by ID
     */
    public function getAccount(string $accountId): BankAccountData;

    /**
     * Get the balances for an account
     */
    public function getAccountBalances(string $accountId): BalanceData;

    /**
     * List account transactions for a specific account.
     *
     * @param  string  $accountId  The account ID
     * @param  bool|null  $latest  Whether to get only the latest transactions
     * @param  int|null  $count  The number of transactions to get
     * @return Collection<int, TransactionData>
     */
    public function getTransactions(string $accountId, ?bool $latest = false, ?int $count = 0): Collection;

    /**
     * Get the connection status of the account
     *
     * @return array<string, string>
     */
    public function getConnectionStatus(): array;
}

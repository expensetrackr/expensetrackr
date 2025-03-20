<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\ProviderHandler;
use App\Data\FinanceCore\AccountData;
use App\Data\FinanceCore\BalanceData;
use App\Data\FinanceCore\TransactionData;
use App\Enums\ProviderType;
use Illuminate\Support\Collection;

final readonly class FinanceCoreService implements ProviderHandler
{
    public function __construct(
        private ProviderType $providerType,
        private string $accessToken,
    ) {}

    /**
     * Get the provider instance
     *
     * @return ProviderHandler
     */
    public function getProviderInstance()
    {
        return match ($this->providerType) {
            ProviderType::Teller => new TellerService($this->accessToken),
        };
    }

    /**
     * List account transactions for a specific account.
     *
     * @param  string  $accountId  The account ID
     * @param  bool|null  $latest  Whether to get only the latest transactions
     * @param  int|null  $count  The number of transactions to get
     * @return Collection<int, TransactionData>
     */
    public function getTransactions(string $accountId, ?bool $latest = false, ?int $count = 0): Collection
    {
        return $this->getProviderInstance()->getTransactions($accountId, $latest, $count);
    }

    /**
     * List all accounts for the authenticated user.
     *
     * @return Collection<int, AccountData>
     */
    public function getAccounts(): Collection
    {
        return $this->getProviderInstance()->getAccounts();
    }

    /**
     * Get a single account by ID
     */
    public function getAccount(string $accountId): AccountData
    {
        return $this->getProviderInstance()->getAccount($accountId);
    }

    /**
     * Get the balances for an account
     */
    public function getAccountBalances(string $accountId): BalanceData
    {
        return $this->getProviderInstance()->getAccountBalances($accountId);
    }

    /**
     * Get the connection status of the account
     *
     * @return array<string, string>
     */
    public function getConnectionStatus(): array
    {
        return $this->getProviderInstance()->getConnectionStatus();
    }
}

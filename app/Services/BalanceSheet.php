<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Account;
use App\Models\Workspace;
use App\ValueObjects\Period;
use App\ValueObjects\Series;
use Illuminate\Database\Eloquent\Collection;

final readonly class BalanceSheet
{
    /** @var Collection<int, Account> */
    private Collection $accounts;

    public function __construct(
        private Workspace $workspace
    ) {
        $this->accounts = Account::query()
            ->where('workspace_id', $this->workspace->id)
            ->with('accountable')
            ->get();
    }

    public function totalAssets(): string
    {
        return $this->accounts
            ->filter(fn (Account $account) => $account->type->isAsset())
            ->reduce(fn (string $carry, Account $account): string => bcadd($carry, $account->current_balance, 4), '0');
    }

    public function totalLiabilities(): string
    {
        return $this->accounts
            ->filter(fn (Account $account) => $account->type->isLiability())
            ->reduce(fn (string $carry, Account $account): string => bcadd($carry, $account->current_balance, 4), '0');
    }

    public function netWorth(): string
    {
        return bcadd($this->totalAssets(), $this->totalLiabilities(), 4);
    }

    public function netWorthSeries(): Series
    {
        $query = Account::query()->whereIn('id', $this->accounts->pluck('id'));

        return $query->getBalanceSeries(
            period: Period::last30Days(),
            view: 'net_worth',
            interval: '1 day'
        );
    }

    public function classificationGroups(): array
    {
        $assetGroups = $this->accountGroups('asset');
        $liabilityGroups = $this->accountGroups('liability');

        return [
            [
                'key' => 'asset',
                'display_name' => 'Assets',
                'icon' => 'blocks',
                'account_groups' => $assetGroups,
            ],
            [
                'key' => 'liability',
                'display_name' => 'Debts',
                'icon' => 'scale',
                'account_groups' => $liabilityGroups,
            ],
        ];
    }

    public function accountGroups(?string $type = null): array
    {
        $filteredAccounts = match ($type) {
            'asset' => $this->accounts->filter(fn (Account $account) => $account->type->isAsset()),
            'liability' => $this->accounts->filter(fn (Account $account) => $account->type->isLiability()),
            default => $this->accounts
        };

        if ($filteredAccounts->isEmpty()) {
            return [];
        }

        $classificationTotal = $filteredAccounts->reduce(
            fn (string $carry, Account $account): string => bcadd($carry, $account->current_balance, 4),
            '0'
        );

        return $filteredAccounts->groupBy('accountable_type')
            ->map(function (Collection $accounts, string $accountableType) use ($classificationTotal): array {
                $groupTotal = $accounts->reduce(
                    fn (string $carry, Account $account): string => bcadd($carry, $account->current_balance, 4),
                    '0'
                );

                $weight = $classificationTotal === '0'
                    ? 0
                    : (float) bcmul(bcdiv($groupTotal, $classificationTotal, 4), '100', 2);

                $firstAccount = $accounts->first();

                return [
                    'key' => $this->getAccountableKey($accountableType),
                    'name' => $this->getAccountableName($accountableType),
                    'classification' => $firstAccount->type->value,
                    'total' => $groupTotal,
                    'weight' => $weight,
                    'color' => $this->getAccountableColor($accountableType),
                    'accounts' => $accounts->map(function (Account $account) use ($classificationTotal): array {
                        $weight = $classificationTotal === '0'
                            ? 0
                            : (float) bcmul(bcdiv($account->current_balance, $classificationTotal, 4), '100', 2);

                        return [
                            'id' => $account->id,
                            'name' => $account->name,
                            'current_balance' => $account->current_balance,
                            'type' => $account->type,
                            'weight' => $weight,
                        ];
                    })->sortByDesc('weight')->values()->all(),
                ];
            })
            ->sortByDesc(fn ($group): string => $group['total'])
            ->values()
            ->all();
    }

    private function getAccountableKey(string $type): string
    {
        return mb_strtolower(class_basename($type));
    }

    private function getAccountableName(string $type): string
    {
        $map = [
            'Depository' => 'Bank Accounts',
            'Investment' => 'Investments',
            'Crypto' => 'Cryptocurrency',
            'OtherAsset' => 'Other Assets',
            'CreditCard' => 'Credit Cards',
            'Loan' => 'Loans',
            'OtherLiability' => 'Other Liabilities',
        ];

        return $map[class_basename($type)] ?? class_basename($type);
    }

    private function getAccountableColor(string $type): string
    {
        $map = [
            'Depository' => '#4F46E5', // Indigo
            'Investment' => '#10B981', // Emerald
            'Crypto' => '#F59E0B', // Amber
            'OtherAsset' => '#6366F1', // Indigo
            'CreditCard' => '#EF4444', // Red
            'Loan' => '#EC4899', // Pink
            'OtherLiability' => '#8B5CF6', // Violet
        ];

        return $map[class_basename($type)] ?? '#6B7280'; // Gray
    }
}

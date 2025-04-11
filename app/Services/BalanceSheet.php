<?php

declare(strict_types=1);

namespace App\Services;

use App\Data\Finance\AccountData;
use App\Data\Finance\AccountGroupData;
use App\Data\Finance\BalanceSheetData;
use App\Data\Finance\ChartSeriesData;
use App\Data\Finance\ClassificationGroupData;
use App\Models\Account;
use App\Models\Workspace;
use App\ValueObjects\Period;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

/**
 * @property Collection<int, Account> $accounts
 */
final readonly class BalanceSheet
{
    /** @var Collection<int, Account> */
    private Collection $accounts;

    private ChartService $chartService;

    public function __construct(
        private Workspace $workspace,
    ) {
        $this->accounts = Account::query()
            ->where('workspace_id', $this->workspace->id)
            ->get();

        $this->chartService = new ChartService();
    }

    /**
     * @return numeric-string
     */
    public function totalAssets(): string
    {
        /** @var numeric-string */
        return $this->accounts
            ->filter(fn (Account $account) => $account->type->isAsset())
            ->reduce(fn (string $carry, Account $account): string => bcadd($carry, (string) $account->current_balance, 4), '0.0000');
    }

    /**
     * @return numeric-string
     */
    public function totalLiabilities(): string
    {
        /** @var numeric-string */
        return $this->accounts
            ->filter(fn (Account $account) => $account->type->isLiability())
            ->reduce(fn (string $carry, Account $account): string => bcadd($carry, (string) $account->current_balance, 4), '0.0000');
    }

    /**
     * @return numeric-string
     */
    public function netWorth(): string
    {
        /** @var numeric-string */
        return bcadd($this->totalAssets(), bcmul($this->totalLiabilities(), '-1.0000', 4), 4);
    }

    public function netWorthSeries(?Period $period = null, ?string $interval = null): ChartSeriesData
    {
        /** @var Builder<Account> $query */
        $query = Account::query()->whereIn('id', $this->accounts->pluck('id'));

        return $this->chartService->getBalanceSeries(
            query: $query,
            period: $period ?? Period::last6Months(),
            favorableDirection: 'up',
            view: 'net_worth',
            interval: $interval ?? 'month',
        );
    }

    public function classificationGroups(): BalanceSheetData
    {
        $assetGroups = $this->accountGroupsByClassification('asset');
        $liabilityGroups = $this->accountGroupsByClassification('liability');

        return new BalanceSheetData(
            new ClassificationGroupData(
                'asset',
                'Assets',
                'blocks',
                $assetGroups
            ),
            new ClassificationGroupData(
                'liability',
                'Debts',
                'scale',
                $liabilityGroups
            )
        );
    }

    /**
     * @return array<int, AccountGroupData>
     */
    private function accountGroupsByClassification(string $classification): array
    {
        $accounts = $this->accounts->filter(fn (Account $account) => $account->type->isAsset());
        /** @var numeric-string */
        $total = $this->totalAssets();

        if ($classification === 'liability') {
            $accounts = $this->accounts->filter(fn (Account $account) => $account->type->isLiability());
            /** @var numeric-string */
            $total = $this->totalLiabilities();
        }

        /** @var array<string, Collection<int, Account>> */
        $groupedAccounts = $accounts->groupBy('accountable_type')->all();
        $result = [];

        foreach ($groupedAccounts as $type => $accounts) {
            /** @var numeric-string */
            $groupTotal = $accounts->reduce(function (string $carry, Account $account): string {
                /** @var numeric-string */
                $currentBalance = (string) $account->current_balance;

                /** @var numeric-string */
                return bcadd($carry, $currentBalance, 4);
            }, '0.0000');

            /** @var float */
            $weight = $total === '0.0000' ? 0 : (float) bcmul(bcdiv($groupTotal, $total, 4), '100.0000', 4);

            $accountsData = $accounts->map(function (Account $account) use ($groupTotal): AccountData {
                /** @var numeric-string */
                $currentBalance = (string) $account->current_balance;
                /** @var float */
                $weight = $groupTotal === '0.0000' ? 0 : (float) bcmul(bcdiv($currentBalance, $groupTotal, 4), '100.0000', 4);

                return new AccountData(
                    $account->id,
                    $account->name,
                    $currentBalance,
                    $account->type,
                    $weight
                );
            })->sortByDesc('weight')->values();

            $result[] = new AccountGroupData(
                $this->getAccountableKey($type),
                $this->getAccountableName($type),
                $classification,
                $groupTotal,
                $weight,
                $this->getAccountableColor($type),
                $accountsData->all()
            );
        }

        return $result;
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

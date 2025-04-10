<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Data\Finance\ChartBalanceData;
use App\Data\Finance\ChartSeriesData;
use App\ValueObjects\Period;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

/** @mixin \App\Models\Account */
trait Chartable
{
    /**
     * Scope to get balance series for multiple accounts.
     *
     * @param  Builder<\App\Models\Account>  $query
     * @param  Period  $period  The period to get the series for
     * @param  string  $favorableDirection  One of 'up' or 'down'
     * @param  string  $view  One of 'balance', 'cash_balance', 'holdings_balance'
     * @param  string|null  $interval  The interval to get the series for
     */
    #[Scope]
    public function balanceSeries(
        Builder $query,
        Period $period,
        string $favorableDirection = 'up',
        string $view = 'balance',
        ?string $interval = null
    ): ChartSeriesData {
        if (! in_array($view, ['balance', 'cash_balance', 'holdings_balance', 'net_worth'])) {
            throw new InvalidArgumentException("Invalid view type: {$view}");
        }

        $seriesInterval = $interval ?? $period->getInterval();

        /** @var Collection<int, ChartBalanceData> */
        $balances = static::getBalanceSeriesQuery(
            $period->startDate,
            $period->endDate,
            $seriesInterval,
            $query
        );

        // Only inject current balance if the series is empty or last balance is 0
        $lastBalance = $balances->last();
        $shouldInjectCurrentBalance = $balances->isEmpty() ||
            ($lastBalance && bccomp($lastBalance->balance, '0.0000', 4) === 0);

        if ($shouldInjectCurrentBalance) {
            // Get the current balance for all accounts in the query
            $currentBalances = $query->get()->mapWithKeys(function ($account) {
                /** @var numeric-string $currentBalance */
                $currentBalance = $account->current_balance;
                $balance = bcadd($currentBalance, '0', 4);
                $cashBalance = $account->type->isAsset()
                    ? bcadd($currentBalance, '0', 4)
                    : bcmul($currentBalance, '-1', 4);

                return [$account->id => [
                    'balance' => $balance,
                    'cash_balance' => $cashBalance,
                    'holdings_balance' => '0.0000',
                ]];
            });

            // Create a current balance object with proper decimal handling
            $totalBalance = '0.0000';
            $totalCashBalance = '0.0000';

            foreach ($currentBalances as $balance) {
                /** @var numeric-string */
                $numericBalance = $balance['balance'];
                /** @var numeric-string */
                $numericCashBalance = $balance['cash_balance'];

                $totalBalance = bcadd(
                    $totalBalance,
                    $numericBalance,
                    4
                );
                $totalCashBalance = bcadd(
                    $totalCashBalance,
                    $numericCashBalance,
                    4
                );
            }

            // Only add if the current balance is not zero
            if (bccomp($totalBalance, '0.0000', 4) !== 0) {
                $balances->push(new ChartBalanceData(
                    now()->startOfDay()->toDateString(),
                    $totalBalance,
                    $totalCashBalance,
                    '0.0000'
                ));
            }
        }

        $balances = static::gapfillBalances($balances);

        if ($favorableDirection === 'down') {
            $balances = static::invertBalances($balances);
        }

        return ChartSeriesData::fromPeriodAndBalances(
            $period,
            $seriesInterval,
            $balances,
            $favorableDirection,
            $view
        );
    }

    /**
     * Get the favorable direction for the account.
     */
    public function getFavorableDirection(): string
    {
        return $this->type->isAsset() ? 'up' : 'down';
    }

    /**
     * Get balance series for the account.
     *
     * @param  string  $view  One of 'balance', 'cash_balance', 'holdings_balance'
     *
     * @throws InvalidArgumentException
     */
    public function accountBalanceSeries(
        ?Period $period = null,
        string $view = 'balance',
        ?string $interval = null
    ): ChartSeriesData {
        $period ??= Period::last30Days();

        /** @var Builder<\App\Models\Account> $query */
        $query = static::query()->where('id', $this->id);

        // @phpstan-ignore method.notFound, return.type (scope is a valid method)
        return $query->balanceSeries(
            period: $period,
            view: $view,
            interval: $interval,
            favorableDirection: $this->getFavorableDirection()
        );
    }

    /**
     * Get sparkline series for the account (cached version of balance series).
     */
    public function sparklineSeries(): ChartSeriesData
    {
        $cacheKey = "account_{$this->id}_sparkline";

        /** @var ChartSeriesData */
        return Cache::remember($cacheKey, CarbonImmutable::now()->addHour(), fn () => $this->accountBalanceSeries());
    }

    /**
     * Get the raw SQL query for balance series.
     *
     * @param  Builder<\App\Models\Account>  $query
     * @return Collection<int, ChartBalanceData>
     */
    private static function getBalanceSeriesQuery(
        CarbonImmutable $startDate,
        CarbonImmutable $endDate,
        string $interval,
        Builder $query
    ): Collection {
        $ids = $query->pluck('id')->toArray();

        // Convert interval for PostgreSQL date_trunc
        $pgInterval = match (mb_strtolower(trim(str_replace('1 ', '', $interval)))) {
            'month' => 'month',
            'day' => 'day',
            'week' => 'week',
            'year' => 'year',
            default => 'day'
        };

        /** @var array<int, object{date: string, balance: numeric-string, cash_balance: numeric-string, holdings_balance: numeric-string}> */
        $results = DB::select(
            "WITH dates AS (
                SELECT generate_series(
                    date_trunc(?, ?::timestamp),
                    date_trunc(?, ?::timestamp),
                    ?::interval
                )::timestamp as date
            ),
            latest_balances AS (
                SELECT DISTINCT ON (accounts.id, d.date)
                    d.date,
                    accounts.id as account_id,
                    accounts.accountable_type,
                    COALESCE(
                        (
                            SELECT balance::numeric
                            FROM account_balances ab
                            WHERE ab.account_id = accounts.id
                            AND ab.dated_at <= d.date
                            ORDER BY dated_at DESC
                            LIMIT 1
                        ),
                        0
                    ) as balance
                FROM dates d
                CROSS JOIN accounts
                WHERE accounts.id = ANY(?)
                ORDER BY accounts.id, d.date, date DESC
            )
            SELECT
                d.date::date,
                COALESCE(SUM(
                    CASE
                        WHEN lb.accountable_type IN (
                            'App\\Models\\Depository',
                            'App\\Models\\Investment',
                            'App\\Models\\Crypto',
                            'App\\Models\\OtherAsset'
                        )
                        THEN lb.balance
                        ELSE -lb.balance
                    END
                ), 0)::numeric(19,4) as balance,
                COALESCE(SUM(
                    CASE
                        WHEN lb.accountable_type IN (
                            'App\\Models\\Depository',
                            'App\\Models\\Investment',
                            'App\\Models\\Crypto',
                            'App\\Models\\OtherAsset'
                        )
                        THEN lb.balance
                        ELSE -lb.balance
                    END
                ), 0)::numeric(19,4) as cash_balance,
                COALESCE(SUM(
                    CASE
                        WHEN lb.accountable_type IN (
                            'App\\Models\\Depository',
                            'App\\Models\\Investment',
                            'App\\Models\\Crypto',
                            'App\\Models\\OtherAsset'
                        )
                        THEN 0
                        ELSE 0
                    END
                ), 0)::numeric(19,4) as holdings_balance
            FROM dates d
            LEFT JOIN latest_balances lb ON lb.date = d.date
            GROUP BY d.date
            ORDER BY d.date",
            [
                $pgInterval,
                $startDate->startOfDay(),
                $pgInterval,
                $endDate->endOfDay(),
                "1 {$pgInterval}",
                '{'.implode(',', $ids).'}',
            ]
        );

        return collect($results)->map(fn ($result): ChartBalanceData => new ChartBalanceData(
            $result->date,
            $result->balance,
            $result->cash_balance,
            $result->holdings_balance
        ));
    }

    /**
     * Invert balances for the series.
     *
     * @param  Collection<int, ChartBalanceData>  $balances
     * @return Collection<int, ChartBalanceData>
     */
    private static function invertBalances(Collection $balances): Collection
    {
        return $balances->map(function (ChartBalanceData $balance): ChartBalanceData {
            $invertedBalance = bcmul($balance->balance, '-1.0000', 4);
            $invertedCashBalance = bcmul($balance->cashBalance, '-1.0000', 4);
            $invertedHoldingsBalance = bcmul($balance->holdingsBalance, '-1.0000', 4);

            return new ChartBalanceData(
                $balance->date,
                $invertedBalance,
                $invertedCashBalance,
                $invertedHoldingsBalance
            );
        });
    }

    /**
     * Fill gaps in balance series with previous values.
     *
     * @param  Collection<int, ChartBalanceData>  $balances
     * @return Collection<int, ChartBalanceData>
     */
    private static function gapfillBalances(Collection $balances): Collection
    {
        if ($balances->isEmpty()) {
            return $balances;
        }

        /** @var Collection<int, ChartBalanceData> */
        $gapfilled = collect();
        /** @var ChartBalanceData|null */
        $prev = null;

        foreach ($balances as $curr) {
            if (! $prev) {
                $gapfilled->push($curr);
            } else {
                $gapfilled->push(new ChartBalanceData(
                    $curr->date,
                    $curr->balance ?? $prev->balance,
                    $curr->cashBalance ?? $prev->cashBalance,
                    $curr->holdingsBalance ?? $prev->holdingsBalance
                ));
            }

            $prev = $curr;
        }

        return $gapfilled;
    }
}

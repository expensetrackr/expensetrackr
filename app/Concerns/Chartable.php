<?php

declare(strict_types=1);

namespace App\Concerns;

use App\ValueObjects\Period;
use App\ValueObjects\Series;
use App\ValueObjects\SeriesValue;
use App\ValueObjects\Trend;
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
     */
    #[Scope]
    public function getBalanceSeries(
        Builder $query,
        Period $period,
        string $favorableDirection = 'up',
        string $view = 'balance',
        ?string $interval = null
    ): Series {
        if (! in_array($view, ['balance', 'cash_balance', 'holdings_balance', 'net_worth'])) {
            throw new InvalidArgumentException("Invalid view type: {$view}");
        }

        $seriesInterval = $interval ?? $period->getInterval();

        $balances = static::getBalanceSeriesQuery(
            startDate: $period->startDate,
            endDate: $period->endDate,
            interval: $seriesInterval,
            query: $query
        );

        // Only inject current balance if the series is empty or last balance is 0
        $lastBalance = $balances->last();
        $shouldInjectCurrentBalance = $balances->isEmpty() ||
            ($lastBalance && bccomp((string) ($lastBalance->balance ?? '0.0000'), '0.0000', 4) === 0);

        if ($shouldInjectCurrentBalance) {
            // Get the current balance for all accounts in the query
            $currentBalances = $query->get()->mapWithKeys(function ($account) {
                $balance = bcadd((string) $account->current_balance, '0', 4);
                $cashBalance = $account->type->isAsset()
                    ? bcadd((string) $account->current_balance, '0', 4)
                    : bcmul((string) $account->current_balance, '-1', 4);

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
                $totalBalance = bcadd($totalBalance, $balance['balance'], 4);
                $totalCashBalance = bcadd($totalCashBalance, $balance['cash_balance'], 4);
            }

            $currentBalance = (object) [
                'date' => now()->startOfDay()->toDateString(),
                'balance' => $totalBalance,
                'cash_balance' => $totalCashBalance,
                'holdings_balance' => '0.0000',
            ];

            // Only add if the current balance is not zero
            if (bccomp($currentBalance->balance, '0.0000', 4) !== 0) {
                $balances->push($currentBalance);
            }
        }

        $balances = static::gapfillBalances($balances);

        if ($favorableDirection === 'down') {
            $balances = static::invertBalances($balances);
        }

        // Transform balances directly without sliding window
        $values = $balances->map(fn ($curr) => new SeriesValue(
            date: CarbonImmutable::parse($curr->date),
            dateFormatted: CarbonImmutable::parse($curr->date)->isoFormat('LL'),
            trend: new Trend(
                current: static::getBalanceValueFor($curr, $view),
                previous: null, // We'll update this in a second pass
                favorableDirection: 'up'
            )
        ));

        // Update previous values in a second pass
        $values = $values->map(function ($value, $index) use ($values) {
            if ($index > 0) {
                $prev = $values[$index - 1];
                $value->trend->previous = $prev->trend->current;
            }

            return $value;
        });

        return new Series(
            startDate: $period->startDate,
            endDate: $period->endDate,
            interval: $seriesInterval,
            trend: new Trend(
                current: static::getBalanceValueFor($balances->last(), $view) ?? '0.0000',
                previous: static::getBalanceValueFor($balances->first(), $view) ?? '0.0000',
                favorableDirection: $favorableDirection
            ),
            values: $values
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
    public function balanceSeries(
        ?Period $period = null,
        string $view = 'balance',
        ?string $interval = null
    ): Series {
        $period ??= Period::last30Days();

        return static::where('id', $this->id)->getBalanceSeries(
            period: $period,
            view: $view,
            interval: $interval,
            favorableDirection: $this->getFavorableDirection()
        );
    }

    /**
     * Get sparkline series for the account (cached version of balance series).
     */
    public function sparklineSeries(): Series
    {
        $cacheKey = "account_{$this->id}_sparkline";

        return Cache::remember($cacheKey, CarbonImmutable::now()->addHour(), function () {
            return $this->balanceSeries();
        });
    }

    /**
     * Get the raw SQL query for balance series.
     *
     * @param  Builder<\App\Models\Account>  $query
     * @return Collection<int, object>
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

        return collect(DB::select(
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
                            AND ab.created_at <= d.date
                            ORDER BY created_at DESC
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
                $interval,
                '{'.implode(',', $ids).'}',
            ]
        ));
    }

    /**
     * Get balance value for a specific view type.
     *
     * @throws InvalidArgumentException
     */
    private static function getBalanceValueFor(?object $balanceRecord, string $view): ?string
    {
        if (! $balanceRecord) {
            return '0.0000';
        }

        return match ($view) {
            'balance', 'net_worth' => $balanceRecord->balance,
            'cash_balance' => $balanceRecord->cash_balance,
            'holdings_balance' => $balanceRecord->holdings_balance,
            default => throw new InvalidArgumentException("Invalid view type: {$view}"),
        };
    }

    /**
     * Invert balances for the series.
     *
     * @param  Collection<int, object>  $balances
     * @return Collection<int, object>
     */
    private static function invertBalances(Collection $balances): Collection
    {
        return $balances->map(function ($balance) {
            $balance->balance = bcmul($balance->balance ?? '0.0000', '-1');
            $balance->cash_balance = bcmul($balance->cash_balance ?? '0.0000', '-1');
            $balance->holdings_balance = bcmul($balance->holdings_balance ?? '0.0000', '-1');

            return $balance;
        });
    }

    /**
     * Fill gaps in balance series with previous values.
     *
     * @param  Collection<int, object>  $balances
     * @return Collection<int, object>
     */
    private static function gapfillBalances(Collection $balances): Collection
    {
        $gapfilled = collect();
        $prev = null;

        foreach ($balances as $curr) {
            if (! $prev) {
                // Initialize first record with zeros if null
                $curr->balance ??= '0.0000';
                $curr->cash_balance ??= '0.0000';
                $curr->holdings_balance ??= '0.0000';
            } else {
                // Copy previous values for nil fields
                $curr->balance ??= $prev->balance;
                $curr->cash_balance ??= $prev->cash_balance;
                $curr->holdings_balance ??= $prev->holdings_balance;
            }

            $gapfilled->push($curr);
            $prev = $curr;
        }

        return $gapfilled;
    }
}

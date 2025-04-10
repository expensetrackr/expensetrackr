<?php

declare(strict_types=1);

namespace App\Data\Finance;

use App\ValueObjects\Period;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use InvalidArgumentException;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ChartSeriesData extends Data
{
    public function __construct(
        public readonly CarbonImmutable $startDate,
        public readonly CarbonImmutable $endDate,
        public readonly string $interval,
        public readonly TrendData $trend,
        /** @var array<int, SeriesValueData> */
        public readonly array $values,
    ) {}

    /**
     * Create a new ChartSeriesData from a Period and Collection of ChartBalanceData.
     *
     * @param  Collection<int, ChartBalanceData>  $balances
     */
    public static function fromPeriodAndBalances(
        Period $period,
        string $interval,
        Collection $balances,
        string $favorableDirection = 'up',
        string $view = 'balance'
    ): self {
        $values = $balances->map(function (ChartBalanceData $curr) use ($view, $favorableDirection): SeriesValueData {
            $date = CarbonImmutable::parse($curr->date);

            return new SeriesValueData(
                date: $date,
                dateFormatted: $date->isoFormat('LL'),
                trend: new TrendData(
                    current: match ($view) {
                        'balance', 'net_worth' => $curr->balance,
                        'cash_balance' => $curr->cashBalance,
                        'holdings_balance' => $curr->holdingsBalance,
                        default => throw new InvalidArgumentException("Invalid view type: {$view}"),
                    },
                    previous: null,
                    favorableDirection: $favorableDirection
                )
            );
        });

        // Update previous values in a second pass
        $values = $values->map(function (SeriesValueData $value, int $index) use ($values): SeriesValueData {
            if ($index > 0) {
                $prev = $values[$index - 1];

                return new SeriesValueData(
                    date: $value->date,
                    dateFormatted: $value->dateFormatted,
                    trend: new TrendData(
                        current: $value->trend->current,
                        previous: $prev->trend->current ?? null,
                        favorableDirection: $value->trend->favorableDirection
                    )
                );
            }

            return $value;
        });

        $firstBalance = $balances->first();
        $lastBalance = $balances->last();

        return new self(
            startDate: $period->startDate,
            endDate: $period->endDate,
            interval: $interval,
            trend: new TrendData(
                current: match ($view) {
                    'balance', 'net_worth' => $lastBalance->balance ?? '0.0000',
                    'cash_balance' => $lastBalance->cashBalance ?? '0.0000',
                    'holdings_balance' => $lastBalance->holdingsBalance ?? '0.0000',
                    default => throw new InvalidArgumentException("Invalid view type: {$view}"),
                },
                previous: match ($view) {
                    'balance', 'net_worth' => $firstBalance->balance ?? '0.0000',
                    'cash_balance' => $firstBalance->cashBalance ?? '0.0000',
                    'holdings_balance' => $firstBalance->holdingsBalance ?? '0.0000',
                    default => throw new InvalidArgumentException("Invalid view type: {$view}"),
                },
                favorableDirection: $favorableDirection
            ),
            values: $values->all()
        );
    }
}

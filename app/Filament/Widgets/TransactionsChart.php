<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\Transaction;
use Filament\Widgets\ChartWidget;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;
use Illuminate\Support\Carbon;

final class TransactionsChart extends ChartWidget
{
    protected static ?string $heading = 'Transactions';

    protected static ?int $sort = 2;

    protected function getData(): array
    {
        $trend = Trend::model(Transaction::class)
            ->between(
                start: now()->startOfYear(),
                end: now()->endOfYear(),
            )
            ->perMonth()
            ->count();

        return [
            'datasets' => [
                [
                    'label' => 'Transactions',
                    'data' => $trend->map(function ($value) {
                        if ($value instanceof TrendValue) {
                            return $value->aggregate;
                        }

                        return null;
                    }),
                ],
            ],
            'labels' => $trend->map(function ($value): ?string {
                if ($value instanceof TrendValue) {
                    return Carbon::parse($value->date)->format('M');
                }

                return null;
            }),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}

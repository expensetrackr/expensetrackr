<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Widgets\ChartWidget;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;
use Illuminate\Support\Carbon;

final class UserChart extends ChartWidget
{
    protected static ?string $heading = 'Users';

    protected function getData(): array
    {
        $trend = Trend::model(User::class)
            ->between(
                start: now()->startOfYear(),
                end: now()->endOfYear(),
            )
            ->perMonth()
            ->count();

        return [
            'datasets' => [
                [
                    'label' => 'Users',
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

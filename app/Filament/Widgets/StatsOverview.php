<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Workspace;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

final class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Users', User::query()->count()),
            Stat::make('Total Workspaces', Workspace::query()->count()),
            Stat::make('Total Transactions', Transaction::query()->count()),
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Filament\Pages;

final class Dashboard extends \Filament\Pages\Dashboard
{
    protected static ?string $navigationIcon = 'hugeicons-dashboard-square-02';

    public static function getNavigationIcon(): string
    {
        return 'hugeicons-dashboard-square-02';
    }
}

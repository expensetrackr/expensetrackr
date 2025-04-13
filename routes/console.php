<?php

declare(strict_types=1);

use App\Jobs\SnapshopAccountBalances;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('make:sitemap')->daily();

Schedule::job(SnapshopAccountBalances::class)
    ->dailyAt('02:00')
    ->withoutOverlapping(60) // Prevent overlapping for 60 minutes
    ->appendOutputTo(storage_path('logs/daily-balances.log'))
    ->before(function () {
        Log::info('Starting daily balance snapshot job');
    })
    ->after(function () {
        Log::info('Completed daily balance snapshot job');
    });

Schedule::command('transactions:process-recurring')
    ->daily()
    ->at('00:00')
    ->withoutOverlapping();

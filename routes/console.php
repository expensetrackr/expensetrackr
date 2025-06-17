<?php

declare(strict_types=1);

use App\Console\Commands\MakeSitemap;
use App\Console\Commands\ProcessRecurringTransactionsCommand;
use App\Jobs\SnapshotAccountBalances;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;
use Spatie\Health\Commands\RunHealthChecksCommand;

Schedule::command(MakeSitemap::class)->daily();

Schedule::job(SnapshotAccountBalances::class)
    ->dailyAt('02:00')
    ->withoutOverlapping(60) // Prevent overlapping for 60 minutes
    ->appendOutputTo(storage_path('logs/daily-balances.log'))
    ->before(function () {
        Log::info('Starting daily balance snapshot job');
    })
    ->after(function () {
        Log::info('Completed daily balance snapshot job');
    });

Schedule::command(ProcessRecurringTransactionsCommand::class)
    ->daily()
    ->at('00:00')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/recurring-transactions.log'))
    ->before(function () {
        Log::info('Starting recurring transactions processing job');
    })
    ->after(function () {
        Log::info('Completed recurring transactions processing job');
    });

Schedule::command(RunHealthChecksCommand::class)->everyMinute();

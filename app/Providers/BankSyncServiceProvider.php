<?php

declare(strict_types=1);

namespace App\Providers;

use App\Jobs\SyncBankAccounts;
use App\Models\BankConnection;
use Exception;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

final class BankSyncServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->app->booted(function (): void {
            $schedule = $this->app->make(Schedule::class);

            try {
                // First verify that BankConnection table exists
                if (! Schema::hasTable('bank_connections')) {
                    Log::error('BankConnection table does not exist');

                    return;
                }

                // Get all bank connections and schedule their sync jobs
                BankConnection::chunk(100, function ($connections) use ($schedule): void {
                    foreach ($connections as $connection) {
                        // Extract the time from the connection's created_at timestamp
                        $syncTime = $connection->created_at ? $connection->created_at->format('H:i') : '00:00';

                        // Schedule the job to run daily at the same time the connection was created
                        $schedule->job(new SyncBankAccounts(
                            $connection->workspace_id,
                            $connection->id
                        ))
                            ->dailyAt(time: $syncTime)
                            ->withoutOverlapping()
                            ->name("sync-bank-connection-{$connection->id}")
                            ->onFailure(function () use ($connection): void {
                                Log::error("Failed to sync bank connection {$connection->id} for workspace {$connection->workspace_id}");
                            });
                    }
                });
            } catch (Exception $e) {
                Log::error('Failed to schedule bank sync jobs: '.$e->getMessage(), [
                    'exception' => $e,
                ]);
            }
        });
    }
}

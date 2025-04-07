<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Account;
use App\Models\AccountBalance;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

final class SnapshopAccountBalances implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 60;

    /**
     * The number of seconds after which the job's unique lock will be released.
     */
    public int $uniqueFor = 3600; // 1 hour

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * The unique ID of the job.
     */
    public function uniqueId(): string
    {
        return 'save_account_balances_'.now()->toDateString();
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Ensure we're using the start of day for consistency
            $now = now()->startOfDay();

            Account::query()
                ->select(['id', 'current_balance', 'workspace_id'])
                ->chunk(1000, function ($accounts) use ($now) {
                    $balances = $accounts->map(fn ($account) => [
                        'balance' => $account->current_balance,
                        'dated_at' => $now,
                        'account_id' => $account->id,
                        'workspace_id' => $account->workspace_id,
                    ])->toArray();

                    AccountBalance::insert($balances);
                });
        } catch (Throwable $e) {
            $this->fail("Failed to save daily balances: {$e->getMessage()}");
        }
    }
}

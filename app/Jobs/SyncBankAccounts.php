<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\BankConnection;
use App\Models\Workspace;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

final class SyncBankAccounts implements ShouldBeUnique, ShouldQueue
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
    public function __construct(
        public readonly int $workspaceId,
        public readonly int $bankConnectionId,
    ) {
        $this->onQueue('bank-sync');
    }

    /**
     * The unique ID of the job.
     */
    public function uniqueId(): string
    {
        return "{$this->bankConnectionId}-{$this->workspaceId}";
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Workspace::findOrFail($this->workspaceId);
        BankConnection::findOrFail($this->bankConnectionId);

        // Add your account synchronization logic here
        // This could involve making API calls to the banking provider,
        // updating transaction records, refreshing balances, etc.

        // Example placeholder for actual implementation:
        // $syncService = app(BankSyncService::class);
        // $syncService->syncAccounts($bankConnection, $workspace);
    }
}

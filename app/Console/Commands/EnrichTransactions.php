<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Jobs\EnrichTransactionJob;
use App\Models\Transaction;
use Illuminate\Console\Command;

final class EnrichTransactions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'transactions:enrich';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Enrich transactions';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        Transaction::query()->chunkById(500, function ($transactions): void {
            foreach ($transactions as $transaction) {
                EnrichTransactionJob::dispatch($transaction);

                $this->info("Processed transaction {$transaction->id}");
            }
        });
    }
}

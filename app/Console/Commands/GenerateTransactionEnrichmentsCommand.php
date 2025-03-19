<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Jobs\ProcessTransactionEnrichment;
use App\Models\Transaction;
use Illuminate\Console\Command;

final class GenerateTransactionEnrichmentsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'enrichments:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate transaction enrichments';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $transactions = Transaction::query()->get();

        foreach ($transactions as $transaction) {
            ProcessTransactionEnrichment::dispatch($transaction);

            $this->info("Processed transaction {$transaction->id}");
        }
    }
}

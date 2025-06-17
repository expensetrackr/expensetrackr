<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Jobs\ProcessRecurringTransactions as ProcessRecurringTransactionsJob;
use Illuminate\Console\Command;

final class ProcessRecurringTransactions extends Command
{
    protected $signature = 'transactions:process-recurring';

    protected $description = 'Process recurring transactions and create new instances';

    public function handle(): int
    {
        $this->info('Processing recurring transactions...');

        ProcessRecurringTransactionsJob::dispatch();

        $this->info('Recurring transactions job dispatched.');

        return self::SUCCESS;
    }
}

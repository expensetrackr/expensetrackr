<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\Finance\TransactionRecurringInterval;
use App\Models\Transaction;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

final class ProcessRecurringTransactionsCommand extends Command
{
    protected $signature = 'transactions:process-recurring';

    protected $description = 'Process recurring transactions and create new instances';

    public function handle(): void
    {
        $this->info('Processing recurring transactions...');

        DB::transaction(function (): void {
            // Get all recurring transactions that have either:
            // 1. Already started (recurring_start_date in the past or null)
            // 2. Are due to start today
            $now = Carbon::now();

            $recurringTransactions = Transaction::query()
                ->where('is_recurring', true)
                ->whereNotNull('recurring_interval')
                ->where(function ($query) use ($now): void {
                    $query->whereNull('recurring_start_at')
                        ->orWhere('recurring_start_at', '<=', $now);
                })
                ->get();

            foreach ($recurringTransactions as $transaction) {
                $this->processRecurringTransaction($transaction);
            }
        });

        $this->info('Recurring transactions processed successfully.');
    }

    /**
     * Process a recurring transaction and create a new instance if necessary.
     *
     * @param  Transaction  $transaction  The transaction to process.
     */
    private function processRecurringTransaction(Transaction $transaction): void
    {
        $now = Carbon::now();

        /**
         * Get the latest child transaction's date, or use the parent's start date/dated_at
         *
         * @var CarbonImmutable|null
         */
        $lastDate = $transaction->recurringChildren()
            ->orderByDesc('dated_at')
            ->value('dated_at');

        if (! $lastDate) {
            $lastDate = $transaction->recurring_start_at ?? $transaction->dated_at;
        }

        // Convert to CarbonImmutable since calculateNextDate expects it
        $lastDate = CarbonImmutable::parse($lastDate);

        // Calculate the next date based on the interval
        $nextDate = $this->calculateNextDate($lastDate, $transaction->recurring_interval);

        // If next date is in the future, skip
        if ($nextDate->isAfter($now)) {
            return;
        }

        // Check if a transaction already exists for this date
        $existingTransaction = $transaction->recurringChildren()
            ->where('dated_at', $nextDate)
            ->exists();

        if ($existingTransaction) {
            return;
        }

        // Create new transaction instance
        $newTransaction = $transaction->replicate([
            'public_id',
            'external_id',
            'created_at',
            'updated_at',
            'recurring_parent_id',
        ]);

        $newTransaction->dated_at = $nextDate;
        $newTransaction->recurring_parent_id = $transaction->id;

        // Clear the recurring_start_date as it's only needed on the parent
        $newTransaction->recurring_start_at = null;
        $newTransaction->is_recurring = false; // Child transactions should not be recurring themselves

        $newTransaction->save();

        // Process next occurrence if needed (for cases where multiple occurrences are due)
        $this->processRecurringTransaction($transaction);
    }

    /**
     * Calculate the next date for a recurring transaction based on the interval.
     *
     * @param  CarbonImmutable  $date  The base date to calculate from.
     * @param  TransactionRecurringInterval|null  $interval  The interval to calculate the next date for.
     * @return CarbonImmutable The next date.
     */
    private function calculateNextDate(CarbonImmutable $date, ?TransactionRecurringInterval $interval): CarbonImmutable
    {
        return match ($interval) {
            TransactionRecurringInterval::Daily => $date->addDay(),
            TransactionRecurringInterval::Weekly => $date->addWeek(),
            TransactionRecurringInterval::Monthly => $date->addMonth(),
            TransactionRecurringInterval::Quarterly => $date->addQuarter(),
            TransactionRecurringInterval::Yearly => $date->addYear(),
            default => $date,
        };
    }
}

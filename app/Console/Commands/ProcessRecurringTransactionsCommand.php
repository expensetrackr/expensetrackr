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

        // Use recurring_start_date if set, otherwise use dated_at
        $lastDate = $transaction->recurring_start_at ?? $transaction->dated_at;

        // If this is the first occurrence and we have a start date
        if ($transaction->recurring_start_at && $transaction->recurringChildren->isEmpty()) {
            $nextDate = $transaction->recurring_start_at;
        } else {
            $nextDate = $this->calculateNextDate($lastDate, $transaction->recurring_interval);
        }

        // If next date is in the future, skip
        if ($nextDate->isAfter($now)) {
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

        $newTransaction->save();

        // Update original transaction's date for next calculation
        $transaction->dated_at = $nextDate;
        $transaction->save();
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

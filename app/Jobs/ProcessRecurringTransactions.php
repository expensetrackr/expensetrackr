<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Enums\Finance\TransactionRecurringInterval;
use App\Models\Transaction;
use Carbon\CarbonImmutable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

final class ProcessRecurringTransactions implements ShouldQueue
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
    public int $uniqueFor = 86_400; // 24 hours

    /**
     * The unique ID of the job.
     */
    public function uniqueId(): string
    {
        return 'process_recurring_transactions_'.now()->toDateString();
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $now = CarbonImmutable::now();

        Transaction::query()
            ->where('is_recurring', true)
            ->whereNotNull('recurring_interval')
            ->where(function ($query) use ($now): void {
                $query->whereNull('recurring_start_at')
                    ->orWhere('recurring_start_at', '<=', $now);
            })
            ->chunkById(500, function ($transactions): void {
                DB::transaction(function () use ($transactions): void {
                    foreach ($transactions as $transaction) {
                        $this->processRecurringTransaction($transaction);
                    }
                });
            });
    }

    /**
     * Process a recurring transaction and create a new instance if necessary.
     */
    private function processRecurringTransaction(Transaction $transaction): void
    {
        $now = CarbonImmutable::now();

        /** @var CarbonImmutable|null $lastDate */
        $lastDate = $transaction->recurringChildren()
            ->orderByDesc('dated_at')
            ->value('dated_at');

        if (! $lastDate) {
            $lastDate = $transaction->recurring_start_at ?? $transaction->dated_at;
        }

        // Ensure immutable instance
        $lastDate = CarbonImmutable::parse($lastDate);

        while (true) {
            $nextDate = $this->calculateNextDate($lastDate, $transaction->recurring_interval);

            // Prevent infinite loop if calculateNextDate returns the same date
            if ($nextDate->equalTo($lastDate)) {
                break;
            }

            // Stop if the next occurrence is in the future
            if ($nextDate->isAfter($now)) {
                break;
            }

            // Stop if the occurrence already exists
            if ($transaction->recurringChildren()->where('dated_at', $nextDate)->exists()) {
                break;
            }

            $newTransaction = $transaction->replicate([
                'public_id',
                'external_id',
                'created_at',
                'updated_at',
                'recurring_parent_id',
            ]);

            $newTransaction->dated_at = $nextDate;
            $newTransaction->recurring_parent_id = $transaction->id;
            $newTransaction->recurring_start_at = null;
            $newTransaction->is_recurring = false;

            $newTransaction->save();

            // Update lastDate for the next iteration
            $lastDate = $nextDate;
        }
    }

    /**
     * Calculate the next date for a recurring transaction based on the interval.
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

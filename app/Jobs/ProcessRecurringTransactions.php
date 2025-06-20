<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Enums\Finance\TransactionRecurringInterval;
use App\Models\Transaction;
use Carbon\CarbonImmutable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

final class ProcessRecurringTransactions implements ShouldBeUnique, ShouldQueue
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
    public int $uniqueFor = 7_200; // 2 hours

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

        $baseQuery = Transaction::query()
            ->with(['recurringChildren' => function ($query): void {
                $query->select('id', 'recurring_parent_id', 'dated_at');
            }])
            ->where('is_recurring', true)
            ->whereNull('recurring_parent_id')   // only root parents
            ->whereNotNull('recurring_interval')
            ->where(function ($query) use ($now): void {
                $query->whereNull('recurring_start_at')
                    ->orWhere('recurring_start_at', '<=', $now);
            });

        $totalTransactions = (clone $baseQuery)->count();

        Log::info('Processing recurring transactions', [
            'total_found' => $totalTransactions,
            'chunk_size' => 500,
        ]);

        $baseQuery->chunkById(500, function ($transactions): void {
            foreach ($transactions as $transaction) {
                DB::transaction(function () use ($transaction): void {
                    try {
                        $this->processRecurringTransaction($transaction);
                    } catch (Throwable $e) {
                        Log::error('Failed to process recurring transaction', [
                            'transaction_id' => $transaction->id,
                            'error' => $e->getMessage(),
                        ]);
                    }
                });
            }
        });
    }

    /**
     * Process a recurring transaction and create a new instance if necessary.
     */
    private function processRecurringTransaction(Transaction $transaction): void
    {
        $now = CarbonImmutable::now();

        $lastDate = $transaction->recurringChildren
            ->sortByDesc('dated_at')
            ->first()?->dated_at;

        if (! $lastDate) {
            $lastDate = $transaction->recurring_start_at ?? $transaction->dated_at;
        }

        $lastDate = CarbonImmutable::parse($lastDate);

        $existingDates = $transaction->recurringChildren
            ->mapWithKeys(fn ($child) => [CarbonImmutable::parse($child->dated_at)->toDateString() => true])
            ->all();

        $maxCatchUp = 100; // safety limit
        $processedCount = 0;

        while ($processedCount < $maxCatchUp) {
            $nextDate = $this->calculateNextDate($lastDate, $transaction->recurring_interval);

            // Prevent infinite loop if calculateNextDate returns the same date
            if ($nextDate->equalTo($lastDate)) {
                break;
            }

            // Stop if the next occurrence is in the future
            if ($nextDate->isAfter($now)) {
                break;
            }

            // Skip if the occurrence already exists and continue processing future dates
            if (isset($existingDates[$nextDate->toDateString()])) {
                // Advance the date pointer to avoid infinite loop
                $lastDate = $nextDate;

                continue;
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
            $newTransaction->recurring_interval = null; // child should not recur

            $newTransaction->save();

            $existingDates[$nextDate->toDateString()] = true;

            $processedCount++;

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

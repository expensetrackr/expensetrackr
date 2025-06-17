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
use Illuminate\Support\Facades\Log;
use Throwable;

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

        $baseQuery = Transaction::query()
            ->where('is_recurring', true)
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

        /** @var CarbonImmutable|null $lastDate */
        $lastDate = $transaction->recurringChildren()
            ->orderByDesc('dated_at')
            ->value('dated_at');

        if (! $lastDate) {
            $lastDate = $transaction->recurring_start_at ?? $transaction->dated_at;
        }

        // Ensure immutable instance
        $lastDate = CarbonImmutable::parse($lastDate);

        // Prefetch existing child dates to avoid querying inside the loop
        $existingDates = $transaction->recurringChildren()
            ->pluck('dated_at')
            ->map(fn ($date) => CarbonImmutable::parse($date)->toDateString())
            ->toArray();

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

            // Stop if the occurrence already exists
            if (in_array($nextDate->toDateString(), $existingDates, true)) {
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

            // Track the new occurrence
            $existingDates[] = $nextDate->toDateString();

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

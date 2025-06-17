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
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

final class ProcessRecurringTransactions implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        DB::transaction(function (): void {
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
    }

    /**
     * Process a recurring transaction and create a new instance if necessary.
     */
    private function processRecurringTransaction(Transaction $transaction): void
    {
        $now = Carbon::now();

        /** @var CarbonImmutable|null $lastDate */
        $lastDate = $transaction->recurringChildren()
            ->orderByDesc('dated_at')
            ->value('dated_at');

        if (! $lastDate) {
            $lastDate = $transaction->recurring_start_at ?? $transaction->dated_at;
        }

        // Ensure immutable instance
        $lastDate = CarbonImmutable::parse($lastDate);

        $nextDate = $this->calculateNextDate($lastDate, $transaction->recurring_interval);

        if ($nextDate->isAfter($now)) {
            return;
        }

        $existingTransaction = $transaction->recurringChildren()
            ->where('dated_at', $nextDate)
            ->exists();

        if ($existingTransaction) {
            return;
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

        // Recursively process next occurrence if due
        $this->processRecurringTransaction($transaction);
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

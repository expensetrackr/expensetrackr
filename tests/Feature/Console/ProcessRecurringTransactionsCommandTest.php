<?php

declare(strict_types=1);

namespace Tests\Feature\Console;

use App\Enums\Finance\TransactionRecurringInterval;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class ProcessRecurringTransactionsCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_recurring_transactions_correctly(): void
    {
        // Create a recurring transaction dated 5 days ago
        $baseDate = Carbon::now()->subDays(5);

        /** @var Transaction $transaction */
        $transaction = Transaction::factory()->create([
            'is_recurring' => true,
            'recurring_interval' => TransactionRecurringInterval::Daily,
            'dated_at' => $baseDate,
        ]);

        // Run the command
        $this->artisan('transactions:process-recurring')->assertSuccessful();

        // Should create 5 transactions (one for each day)
        $this->assertDatabaseCount('transactions', 6); // Original + 5 recurring

        // Verify dates are correct
        $children = $transaction->recurringChildren()->orderBy('dated_at')->get();
        $this->assertCount(5, $children);

        foreach ($children as $index => $child) {
            $expectedDate = $baseDate->copy()->addDays($index + 1)->startOfDay();
            $this->assertTrue(
                $child->dated_at->startOfDay()->equalTo($expectedDate),
                "Transaction {$index} has incorrect date"
            );
            $this->assertFalse($child->is_recurring, 'Child transaction should not be recurring');
        }
    }

    public function test_it_does_not_duplicate_transactions(): void
    {
        // Create a recurring transaction dated yesterday
        $baseDate = Carbon::now()->subDay();

        /** @var Transaction $transaction */
        $transaction = Transaction::factory()->create([
            'is_recurring' => true,
            'recurring_interval' => TransactionRecurringInterval::Daily,
            'dated_at' => $baseDate,
        ]);

        // Run the command twice
        $this->artisan('transactions:process-recurring')->assertSuccessful();
        $this->artisan('transactions:process-recurring')->assertSuccessful();

        // Should only create 1 transaction despite running twice
        $this->assertDatabaseCount('transactions', 2); // Original + 1 recurring

        $children = $transaction->recurringChildren;
        $this->assertCount(1, $children);

        $child = $children->first();
        $this->assertTrue(
            $child->dated_at->startOfDay()->equalTo(Carbon::now()->startOfDay()),
            'Transaction has incorrect date'
        );
        $this->assertFalse($child->is_recurring, 'Child transaction should not be recurring');
    }

    public function test_it_respects_recurring_start_date(): void
    {
        // Create a recurring transaction with future start date
        $startDate = Carbon::now()->addDays(2);

        /** @var Transaction $transaction */
        $transaction = Transaction::factory()->create([
            'is_recurring' => true,
            'recurring_interval' => TransactionRecurringInterval::Daily,
            'dated_at' => Carbon::now()->subDays(5),
            'recurring_start_at' => $startDate,
        ]);

        // Run the command
        $this->artisan('transactions:process-recurring')->assertSuccessful();

        // Should not create any transactions yet
        $this->assertDatabaseCount('transactions', 1); // Just the original
        $this->assertCount(0, $transaction->recurringChildren);
    }
}

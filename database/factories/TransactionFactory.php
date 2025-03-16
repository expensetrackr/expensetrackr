<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
final class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(),
            'note' => fake()->sentence(),
            'status' => fake()->randomElement(TransactionStatus::cases()),
            'type' => fake()->randomElement(TransactionType::cases()),
            'base_amount' => fake()->randomNumber(5),
            'base_currency' => fake()->currencyCode(),
            'currency_rate' => fake()->randomFloat(2, 0, 10),
            'amount' => fake()->randomNumber(5),
            'currency' => fake()->currencyCode(),
            'is_recurring' => fake()->boolean(),
            'is_manual' => fake()->boolean(),
            'dated_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'external_id' => fake()->uuid(),
            'workspace_id' => Workspace::factory(),
            'public_id' => fake()->uuid(),
        ];
    }
}

<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\AccountType;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
final class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'description' => $this->faker->sentence(),
            'currency_code' => $this->faker->currencyCode(),
            'initial_balance' => $this->faker->randomFloat(2, 0, 1000),
            'current_balance' => $this->faker->randomFloat(2, 0, 1000),
            'type' => $this->faker->randomElement(array_column(AccountType::cases(), 'value')),
            'is_default' => $this->faker->boolean(),
            'workspace_id' => Workspace::factory(),
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }
}

<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\CreditCard;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/** @extends Factory<CreditCard> */
final class CreditCardFactory extends Factory
{
    protected $model = CreditCard::class;

    public function definition(): array
    {
        return [
            'available_credit' => $this->faker->randomFloat(),
            'minimum_payment' => $this->faker->randomFloat(),
            'apr' => $this->faker->randomFloat(),
            'anual_fee' => $this->faker->randomFloat(),
            'expires_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}

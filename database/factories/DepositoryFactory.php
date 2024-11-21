<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Depository;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<Depository>
 */
final class DepositoryFactory extends Factory
{
    protected $model = Depository::class;

    public function definition(): array
    {
        return [
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}

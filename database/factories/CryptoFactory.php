<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Crypto;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/** @extends Factory<Crypto> */
final class CryptoFactory extends Factory
{
    protected $model = Crypto::class;

    public function definition(): array
    {
        return [
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}

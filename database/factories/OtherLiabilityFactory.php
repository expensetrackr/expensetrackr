<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\OtherLiability;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/** @extends Factory<OtherLiability>  */
final class OtherLiabilityFactory extends Factory
{
    protected $model = OtherLiability::class;

    public function definition(): array
    {
        return [
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}

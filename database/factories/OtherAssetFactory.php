<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\OtherAsset;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/** @extends Factory<OtherAsset> */
final class OtherAssetFactory extends Factory
{
    protected $model = OtherAsset::class;

    public function definition(): array
    {
        return [
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}

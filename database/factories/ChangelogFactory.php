<?php

declare(strict_types=1);

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Changelog>
 */
final class ChangelogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    // File: database/factories/ChangelogFactory.php

    public function definition(): array
    {
        return [
            'image_path' => fake()->imageUrl(),
            'title' => fake()->sentence(),
            'slug' => fake()->unique()->slug(),
            'content' => fake()->paragraphs(3, true),
            'public_id' => 'chg_'.fake()->unique()->regexify('[A-Za-z0-9]{10}'),
            'published_at' => fake()->boolean(80) ? fake()->dateTimeBetween('-1 year') : null,
            'excerpt' => fake()->optional()->paragraph(),
        ];
    }
}

<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

final class SystemCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // Income categories
            ['name' => 'Salary', 'color' => '#00A86B', 'icon' => 'money'],
            ['name' => 'Investments', 'color' => '#50C878', 'icon' => 'chart-line'],
            ['name' => 'Freelance', 'color' => '#4CAF50', 'icon' => 'laptop'],
            ['name' => 'Gifts', 'color' => '#98FB98', 'icon' => 'gift'],

            // Expense categories
            ['name' => 'Housing', 'color' => '#FF6B6B', 'icon' => 'home'],
            ['name' => 'Transportation', 'color' => '#4A90E2', 'icon' => 'car'],
            ['name' => 'Food', 'color' => '#FFA726', 'icon' => 'utensils'],
            ['name' => 'Utilities', 'color' => '#7E57C2', 'icon' => 'bolt'],
            ['name' => 'Healthcare', 'color' => '#EC407A', 'icon' => 'hospital'],
            ['name' => 'Entertainment', 'color' => '#9C27B0', 'icon' => 'film'],
            ['name' => 'Shopping', 'color' => '#FF5722', 'icon' => 'shopping-bag'],
            ['name' => 'Education', 'color' => '#3F51B5', 'icon' => 'graduation-cap'],

            // Transfer category
            ['name' => 'Transfer', 'color' => '#607D8B', 'icon' => 'exchange-alt'],

            // Other category (catch-all)
            ['name' => 'Other', 'color' => '#9E9E9E', 'icon' => 'ellipsis-h'],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'color' => $category['color'],
                'icon' => $category['icon'],
                'is_system' => true,
                'public_id' => Str::uuid(),
                'workspace_id' => null, // System categories don't belong to any workspace
            ]);
        }
    }
}

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
            [
                'name' => 'Salary',
                'color' => '#00A86B',
                'description' => 'Regular income from employment, including wages, bonuses, and other compensation from your employer.',
            ],
            [
                'name' => 'Investments',
                'color' => '#50C878',
                'description' => 'Income from investments such as dividends, interest, capital gains, rental income, and other returns on investments.',
            ],
            [
                'name' => 'Freelance',
                'color' => '#4CAF50',
                'description' => 'Income from self-employment, contract work, consulting, or any independent professional services.',
            ],
            [
                'name' => 'Gifts',
                'color' => '#98FB98',
                'description' => 'Money received as gifts, inheritances, or other forms of monetary presents from family and friends.',
            ],

            // Expense categories
            [
                'name' => 'Housing',
                'color' => '#FF6B6B',
                'description' => 'Housing-related expenses including rent, mortgage, property taxes, home insurance, repairs, and maintenance.',
            ],
            [
                'name' => 'Transportation',
                'color' => '#4A90E2',
                'description' => 'Costs related to transportation including car payments, fuel, public transit, maintenance, parking, and ride-sharing services.',
            ],
            [
                'name' => 'Food',
                'color' => '#FFA726',
                'description' => 'All food-related expenses including groceries, restaurants, takeout, and food delivery services.',
            ],
            [
                'name' => 'Utilities',
                'color' => '#7E57C2',
                'description' => 'Regular utility bills including electricity, water, gas, internet, phone, and other household services.',
            ],
            [
                'name' => 'Healthcare',
                'color' => '#EC407A',
                'description' => 'Medical expenses including insurance premiums, doctor visits, medications, and other health-related costs.',
            ],
            [
                'name' => 'Entertainment',
                'color' => '#9C27B0',
                'description' => 'Leisure and entertainment expenses including streaming services, movies, concerts, hobbies, and recreational activities.',
            ],
            [
                'name' => 'Shopping',
                'color' => '#FF5722',
                'description' => 'Personal shopping expenses including clothing, electronics, household items, and other retail purchases.',
            ],
            [
                'name' => 'Education',
                'color' => '#3F51B5',
                'description' => 'Educational expenses including tuition, books, courses, training programs, and professional development.',
            ],

            // Transfer category
            [
                'name' => 'Transfer',
                'color' => '#607D8B',
                'description' => 'Money movements between your own accounts. These transactions don\'t affect your overall balance.',
            ],

            // Other category (catch-all)
            [
                'name' => 'Other',
                'color' => '#9E9E9E',
                'description' => 'Miscellaneous transactions that don\'t fit into other categories. Consider creating a custom category if you have many similar transactions here.',
            ],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'color' => $category['color'],
                'description' => $category['description'],
                'is_system' => true,
                'public_id' => Str::uuid(),
                'workspace_id' => null, // System categories don't belong to any workspace
            ]);
        }
    }
}

<?php

declare(strict_types=1);

namespace App\Actions\Categories;

use App\Enums\Finance\CategoryClassification;
use App\Models\Category;
use App\Models\Workspace;
use Illuminate\Support\Str;

final class CreateSystemCategories
{
    /**
     * Create system categories for a workspace.
     */
    public function handle(Workspace $workspace): void
    {
        $categories = [
            // Income categories
            [
                'name' => 'Salary',
                'color' => '#00A86B',
                'description' => 'Regular income from employment, including wages, bonuses, and other compensation from your employer.',
                'classification' => CategoryClassification::Income,
            ],
            [
                'name' => 'Investments',
                'color' => '#50C878',
                'description' => 'Income from investments such as dividends, interest, capital gains, rental income, and other returns on investments.',
                'classification' => CategoryClassification::Income,
            ],
            [
                'name' => 'Freelance',
                'color' => '#4CAF50',
                'description' => 'Income from self-employment, contract work, consulting, or any independent professional services.',
                'classification' => CategoryClassification::Income,
            ],
            [
                'name' => 'Gifts',
                'color' => '#98FB98',
                'description' => 'Money received as gifts, inheritances, or other forms of monetary presents from family and friends.',
                'classification' => CategoryClassification::Income,
            ],

            // Expense categories
            [
                'name' => 'Housing',
                'color' => '#FF6B6B',
                'description' => 'Housing-related expenses including rent, mortgage, property taxes, home insurance, repairs, and maintenance.',
                'classification' => CategoryClassification::Expense,
            ],
            [
                'name' => 'Transportation',
                'color' => '#4A90E2',
                'description' => 'Costs related to transportation including car payments, fuel, public transit, maintenance, parking, and ride-sharing services.',
                'classification' => CategoryClassification::Expense,
            ],
            [
                'name' => 'Groceries',
                'color' => '#FFA726',
                'description' => 'Essential food and household items purchased from supermarkets and grocery stores.',
                'classification' => CategoryClassification::Expense,
            ],
            [
                'name' => 'Dining',
                'color' => '#FF9800',
                'description' => 'Expenses at restaurants, cafes, bars, and food delivery services.',
                'classification' => CategoryClassification::Expense,
            ],
            [
                'name' => 'Utilities',
                'color' => '#7E57C2',
                'description' => 'Regular utility bills including electricity, water, gas, internet, phone, and other household services.',
                'classification' => CategoryClassification::Expense,
            ],
            [
                'name' => 'Healthcare',
                'color' => '#EC407A',
                'description' => 'Medical expenses including insurance premiums, doctor visits, medications, and other health-related costs.',
                'classification' => CategoryClassification::Expense,
            ],
            [
                'name' => 'Entertainment',
                'color' => '#9C27B0',
                'description' => 'Leisure and entertainment expenses including streaming services, movies, concerts, hobbies, and recreational activities.',
                'classification' => CategoryClassification::Expense,
            ],
            [
                'name' => 'Shopping',
                'color' => '#FF5722',
                'description' => 'Personal shopping expenses including clothing, electronics, household items, and other retail purchases.',
                'classification' => CategoryClassification::Expense,
            ],
            [
                'name' => 'Education',
                'color' => '#3F51B5',
                'description' => 'Educational expenses including tuition, books, courses, training programs, and professional development.',
                'classification' => CategoryClassification::Expense,
            ],
            [
                'name' => 'Technology',
                'color' => '#00BCD4',
                'description' => 'Technology-related expenses including electronics, software, apps, and digital services.',
                'classification' => CategoryClassification::Expense,
            ],
            [
                'name' => 'Services',
                'color' => '#8D6E63',
                'description' => 'Professional and personal services including maintenance, repairs, consulting, and other service-based expenses.',
                'classification' => CategoryClassification::Expense,
            ],
            [
                'name' => 'Loans',
                'color' => '#F44336',
                'description' => 'Loan payments, credit card payments, and other debt-related expenses.',
                'classification' => CategoryClassification::Expense,
            ],

            // Transfer category
            [
                'name' => 'Transfer',
                'color' => '#607D8B',
                'description' => 'Money movements between your own accounts. These transactions don\'t affect your overall balance.',
                'classification' => CategoryClassification::Transfer,
            ],

            // Other category (catch-all)
            [
                'name' => 'Other',
                'color' => '#9E9E9E',
                'description' => 'Miscellaneous transactions that don\'t fit into other categories. Consider creating a custom category if you have many similar transactions here.',
                'classification' => CategoryClassification::Other,
            ],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'color' => $category['color'],
                'description' => $category['description'],
                'classification' => $category['classification'],
                'is_system' => true,
                'workspace_id' => $workspace->id,
            ]);
        }
    }
}

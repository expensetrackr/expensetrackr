<?php

declare(strict_types=1);

use App\Enums\Finance\CategoryClassification;

return [
    // Income categories
    [
        'name' => 'Salary',
        'slug' => 'salary',
        'color' => '#16A34A',
        'classification' => CategoryClassification::Income,
        'icon' => 'wallet-02',
    ],
    [
        'name' => 'Investments',
        'slug' => 'investments',
        'color' => '#059669',
        'classification' => CategoryClassification::Income,
        'icon' => 'chart-03',
    ],
    [
        'name' => 'Freelance',
        'slug' => 'freelance',
        'color' => '#0D9488',
        'classification' => CategoryClassification::Income,
        'icon' => 'briefcase-01',
    ],
    [
        'name' => 'Gifts',
        'slug' => 'gifts',
        'color' => '#65A30D',
        'classification' => CategoryClassification::Income,
        'icon' => 'gift',
    ],
    [
        'name' => 'Refunds',
        'slug' => 'refunds',
        'color' => '#0891B2',
        'classification' => CategoryClassification::Income,
        'icon' => 'repeat',
    ],
    [
        'name' => 'Rental Income',
        'slug' => 'rental-income',
        'color' => '#4F46E5',
        'classification' => CategoryClassification::Income,
        'icon' => 'home-09',
    ],
    [
        'name' => 'Royalties',
        'slug' => 'royalties',
        'color' => '#7C3AED',
        'classification' => CategoryClassification::Income,
        'icon' => 'license-draft',
    ],
    [
        'name' => 'Cashback',
        'slug' => 'cashback',
        'color' => '#E11D48',
        'classification' => CategoryClassification::Income,
        'icon' => 'receipt-dollar',
    ],

    // Expense categories
    [
        'name' => 'Housing',
        'slug' => 'housing',
        'color' => '#DC2626',
        'classification' => CategoryClassification::Expense,
        'icon' => 'home-09',
    ],
    [
        'name' => 'Mortgage',
        'slug' => 'mortgage',
        'color' => '#B91C1C',
        'classification' => CategoryClassification::Expense,
        'icon' => 'bank',
        'parent_slug' => 'housing',
    ],
    [
        'name' => 'Repairs',
        'slug' => 'repairs',
        'color' => '#B45309',
        'classification' => CategoryClassification::Expense,
        'icon' => 'hammer-01',
        'parent_slug' => 'housing',
    ],
    [
        'name' => 'Transportation',
        'slug' => 'transportation',
        'color' => '#2563EB',
        'classification' => CategoryClassification::Expense,
        'icon' => 'car-05',
    ],
    [
        'name' => 'Groceries',
        'slug' => 'groceries',
        'color' => '#D97706',
        'classification' => CategoryClassification::Expense,
        'icon' => 'shopping-basket-03',
    ],
    [
        'name' => 'Dining',
        'slug' => 'dining',
        'color' => '#EA580C',
        'classification' => CategoryClassification::Expense,
        'icon' => 'kitchen-utensils',
    ],
    [
        'name' => 'Utilities',
        'slug' => 'utilities',
        'color' => '#6D28D9',
        'classification' => CategoryClassification::Expense,
        'icon' => 'plug-01',
    ],
    [
        'name' => 'Healthcare',
        'slug' => 'healthcare',
        'color' => '#DB2777',
        'classification' => CategoryClassification::Expense,
        'icon' => 'pulse-02',
    ],
    [
        'name' => 'Entertainment',
        'slug' => 'entertainment',
        'color' => '#9333EA',
        'classification' => CategoryClassification::Expense,
        'icon' => 'tv-01',
    ],
    // Split categories from Shopping and Services
    [
        'name' => 'Clothing',
        'slug' => 'clothing',
        'color' => '#C2410C',
        'classification' => CategoryClassification::Expense,
        'icon' => 't-shirt',
    ],
    [
        'name' => 'Electronics',
        'slug' => 'electronics',
        'color' => '#F97316',
        'classification' => CategoryClassification::Expense,
        'icon' => 'device-mobile',
    ],
    [
        'name' => 'Home Services',
        'slug' => 'home-services',
        'color' => '#78716C',
        'classification' => CategoryClassification::Expense,
        'icon' => 'wrench-01',
    ],
    // Additional expenses
    [
        'name' => 'Insurance',
        'slug' => 'insurance',
        'color' => '#BE185D',
        'classification' => CategoryClassification::Expense,
        'icon' => 'shield',
    ],
    [
        'name' => 'Taxes',
        'slug' => 'taxes',
        'color' => '#9F1239',
        'classification' => CategoryClassification::Expense,
        'icon' => 'banknote',
    ],
    [
        'name' => 'Subscriptions',
        'slug' => 'subscriptions',
        'color' => '#C026D3',
        'classification' => CategoryClassification::Expense,
        'icon' => 'receipt',
    ],
    [
        'name' => 'Child Care',
        'slug' => 'child-care',
        'color' => '#CA8A04',
        'classification' => CategoryClassification::Expense,
        'icon' => 'baby',
    ],
    [
        'name' => 'Pets',
        'slug' => 'pets',
        'color' => '#4D7C0F',
        'classification' => CategoryClassification::Expense,
        'icon' => 'paw-print',
    ],
    [
        'name' => 'Charity',
        'slug' => 'charity',
        'color' => '#C026D3',
        'classification' => CategoryClassification::Expense,
        'icon' => 'hand-heart',
    ],
    [
        'name' => 'Personal Care',
        'slug' => 'personal-care',
        'color' => '#A21CAF',
        'classification' => CategoryClassification::Expense,
        'icon' => 'scissors',
    ],
    [
        'name' => 'Holidays & Travel',
        'slug' => 'holidays-travel',
        'color' => '#0E7490',
        'classification' => CategoryClassification::Expense,
        'icon' => 'airplane',
    ],
    [
        'name' => 'Debt Payments',
        'slug' => 'debt-payments',
        'color' => '#C81E1E',
        'classification' => CategoryClassification::Expense,
        'icon' => 'credit-card',
    ],

    // Savings / Investment classification
    [
        'name' => 'Savings',
        'slug' => 'savings',
        'color' => '#047857',
        'classification' => CategoryClassification::Savings,
        'icon' => 'piggy-bank',
    ],

    // Transfer category
    [
        'name' => 'Transfer',
        'slug' => 'transfer',
        'color' => '#475569',
        'classification' => CategoryClassification::Transfer,
        'icon' => 'arrow-left-right',
    ],

    // Other category
    [
        'name' => 'Other',
        'slug' => 'other',
        'color' => '#52525B',
        'classification' => CategoryClassification::Other,
        'icon' => 'more-horizontal-circle-01',
    ],
];

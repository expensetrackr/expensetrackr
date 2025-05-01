<?php

declare(strict_types=1);

return [
    'pricing' => [
        'title' => 'Pricing',
        'description' => 'Transparent pricing for ExpenseTrackr\'s financial management software. Compare our Personal, Business, and Enterprise plans to find the best fit for your personal or business finances.',
    ],
    'changelog' => [
        'title' => 'Changelog',
        'description' => 'Track the evolution of ExpenseTrackr. Our changelog details new features, performance improvements, and bug fixes as we continuously enhance our financial management application.',
    ],
    'accounts' => [
        'title' => 'Accounts',
        'description' => 'Manage your accounts and add new ones.',
        'actions' => [
            'createAccount' => 'Create account',
        ],
        'noAccounts' => [
            'title' => 'You do not have any accounts yet.',
            'description' => 'Click the button to add one.',
        ],
        'detailsDrawer' => [
            'title' => 'Account Details',
            'actions' => [
                'seeAllTransactions' => 'See all transactions',
                'deleteAccount' => 'Delete account',
            ],
        ],
    ],
];

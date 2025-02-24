<?php

declare(strict_types=1);

return [
    'fields' => [
        'email' => [
            'label' => 'Email',
            'placeholder' => 'e.g. john@example.com',
        ],
        'password' => [
            'label' => 'Enter your password',
            'placeholder' => 'e.g. **********',
        ],
        'remember' => [
            'label' => 'Remember me',
        ],
        'name' => [
            'label' => 'Name',
            'placeholder' => 'e.g. John Doe',
        ],
        'new_password' => [
            'label' => 'New password',
            'placeholder' => '8+ characters long, 1 capital letter',
            'hint' => 'Must be at least 8 characters long',
        ],
        'confirm_password' => [
            'label' => 'Confirm password',
            'placeholder' => 'Confirm your password',
        ],
        'initial_balance' => [
            'label' => 'Initial balance',
            'placeholder' => 'e.g. 1.00',
        ],
        'available_balance' => [
            'label' => 'Available credit',
            'placeholder' => 'e.g. 1.00',
        ],
        'minimum_payment' => [
            'label' => 'Minimum payment',
            'placeholder' => 'e.g. 1.00',
        ],
        'apr' => [
            'label' => 'APR',
            'placeholder' => '10',
        ],
        'expires_at' => [
            'label' => 'Expires at',
            'placeholder' => 'Select a date',
        ],
        'interest_rate' => [
            'label' => 'Interest rate',
            'placeholder' => 'e.g. 1.00',
        ],
        'interest_rate_type' => [
            'label' => 'Rate type',
            'placeholder' => 'Select a rate type',
        ],
        'term_months' => [
            'label' => 'Term (months)',
            'placeholder' => '48',
        ],
    ],
];

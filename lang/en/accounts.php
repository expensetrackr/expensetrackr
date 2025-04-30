<?php

declare(strict_types=1);

return [
    'type' => [
        'depository' => 'Depository',
        'investment' => 'Investment',
        'crypto' => 'Crypto',
        'credit_card' => 'Credit Card',
        'loan' => 'Loan',
        'other_asset' => 'Other Asset',
        'other_liability' => 'Other Liability',
    ],
    'form' => [
        'name' => [
            'label' => 'Name',
            'placeholder' => 'e.g. Personal savings',
        ],
        'description' => [
            'label' => 'Description',
            'placeholder' => 'e.g. Savings account for personal expenses',
            'hint' => 'This will only be visible to you.',
            'labelSub' => '(Optional)',
        ],
        'type' => [
            'label' => 'Type',
            'placeholder' => 'Select a type',
        ],
        'subtype' => [
            'label' => 'Subtype',
            'labelSub' => '(Optional)',
            'placeholder' => 'Select a subtype',
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
            'labelSub' => '(Optional)',
            'placeholder' => 'Select a date',
        ],
        'annual_fee' => [
            'label' => 'Annual fee',
            'placeholder' => 'e.g. 1.00',
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
    'create' => [
        'title' => 'Create Account',
        'information' => 'Information',
        'details' => 'Details',
        'balance' => 'Balance',
        'currency' => 'Currency',
        'discard' => 'Discard',
        'submit' => 'Create account',
        'submit_loading' => 'Creating account...',
    ],
    'created' => [
        'success' => 'Account created successfully',
    ],
    'deleted' => [
        'success' => 'Account deleted successfully',
    ],
];

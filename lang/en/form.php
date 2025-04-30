<?php

declare(strict_types=1);

return [
    'fields' => [
        'email' => [
            'label' => 'Email',
            'placeholder' => 'e.g. john@example.com',
        ],
        'password' => [
            'label' => 'Password',
            'placeholder' => 'Enter your password',
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
        'recovery_code' => [
            'label' => 'Recovery code',
        ],
        'code' => [
            'label' => 'Code',
        ],
    ],
];

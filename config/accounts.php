<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Account Cache Configuration
    |--------------------------------------------------------------------------
    |
    | This configuration defines the cache settings for account-related data.
    |
    */

    'cache_ttl' => env('ACCOUNTS_CACHE_TTL', 3600), // 1 hour default

    /*
    |--------------------------------------------------------------------------
    | Account Type Model Mapping
    |--------------------------------------------------------------------------
    |
    | This configuration maps account types to their corresponding model classes.
    | This allows for easy maintenance when models are moved or renamed.
    |
    */

    'type_map' => [
        'depository' => App\Models\Depository::class,
        'credit_card' => App\Models\CreditCard::class,
        'loan' => App\Models\Loan::class,
        'investment' => App\Models\Investment::class,
        'crypto' => App\Models\Crypto::class,
        'other_asset' => App\Models\OtherAsset::class,
        'other_liability' => App\Models\OtherLiability::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Account Type
    |--------------------------------------------------------------------------
    |
    | The default account type to use when an unknown type is encountered.
    |
    */

    'default_type' => 'depository',

    /*
    |--------------------------------------------------------------------------
    | Account Limits by Subscription Tier
    |--------------------------------------------------------------------------
    |
    | This configuration defines the maximum number of accounts allowed
    | for each subscription tier. This makes it easy to adjust limits
    | without modifying code.
    |
    */

    'limits' => [
        'free' => env('ACCOUNTS_LIMIT_FREE', 1),
        'personal' => env('ACCOUNTS_LIMIT_PERSONAL', 5),
        'business' => env('ACCOUNTS_LIMIT_BUSINESS', 10),
        'enterprise' => env('ACCOUNTS_LIMIT_ENTERPRISE', 999),
    ],
];

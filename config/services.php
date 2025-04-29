<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
        'audience_id' => env('RESEND_AUDIENCE_ID'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_CALLBACK_URL'),
    ],

    'currency_api' => [
        'key' => env('CURRENCY_API_KEY', '34h2234ff...'),
        'base_url' => 'https://v6.exchangerate-api.com/v6',
    ],

    'teller' => [
        'key_base64' => env('TELLER_KEY_BASE64'),
        'cert_base64' => env('TELLER_CERT_BASE64'),
        'cert_path' => storage_path('app/teller/teller_cert.pem'),
        'key_path' => storage_path('app/teller/teller_pk.pem'),
        'environment' => env('TELLER_ENVIRONMENT', 'sandbox'),
        'app_id' => env('TELLER_APP_ID'),
        'signing_key' => env('TELLER_SIGNING_KEY'),
        'public_key' => env('TELLER_PUBLIC_KEY'),
    ],

    'synth' => [
        'access_token' => env('SYNTH_ACCESS_TOKEN'),
        'base_url' => 'https://api.synthfinance.com',
    ],

    'polar' => [
        'products' => [
            'monthly' => '42d54e49-6f94-4e90-a137-e850d38ee5c7',
            'yearly' => '88978e70-3cae-479f-a6f9-d6864205b020',
            'lifetime' => 'c969cccd-95cc-4c0c-b7a4-721a61d63e4b',
        ],
    ],
];

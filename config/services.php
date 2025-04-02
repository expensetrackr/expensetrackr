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
        'key' => env('RESEND_KEY'),
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
        'cert_path' => base_path('teller_cert.pem'),
        'key_path' => base_path('teller_pk.pem'),
        'environment' => env('TELLER_ENVIRONMENT', 'sandbox'),
        'app_id' => env('TELLER_APP_ID'),
        'signing_key' => env('TELLER_SIGNING_KEY'),
        'public_key' => env('TELLER_PUBLIC_KEY'),
    ],

    'synth' => [
        'access_token' => env('SYNTH_ACCESS_TOKEN'),
        'base_url' => 'https://api.synthfinance.com',
    ],
];

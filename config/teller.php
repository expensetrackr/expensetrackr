<?php

declare(strict_types=1);

return [
    /**
     * The location in the laravel project where your keys are stored.
     * base_path('your/path/to/keys/teller_pk.pem')
     */
    'KEY_PATH' => base_path('teller_pk.pem'),
    'CERT_PATH' => base_path('teller_cert.pem'),

    'ENVIRONMENT' => env('TELLER_ENVIRONMENT', 'sandbox'),
    'APP_ID' => env('TELLER_APP_ID'),
    'PUBLIC_KEY' => env('TELLER_PUBLIC_KEY'),
    'WEBHOOK_SECRET_KEY' => env('TELLER_WEBHOOK_SECRET_KEY'),
    'TEST_TOKEN' => env('TELLER_TEST_TOKEN'),
];

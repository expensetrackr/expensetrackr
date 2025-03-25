<?php

declare(strict_types=1);

return [
    /**
     * The location in the laravel project where your keys are stored.
     * base_path('your/path/to/keys/teller_pk.pem')
     */
    'key_path' => base_path('teller_pk.pem'),
    'cert_path' => base_path('teller_cert.pem'),

    'ENVIRONMENT' => env('TELLER_ENVIRONMENT', 'sandbox'),
    'app_id' => env('TELLER_APP_ID'),
    'signing_key' => env('TELLER_SIGNING_KEY'),
];

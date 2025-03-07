<?php

/*
 * You can place your custom package configuration in here.
 */
return [
    'url' => env('OPENPANEL_URL', 'https://api.openpanel.dev'),
    'client_id' => env('OPENPANEL_CLIENT_ID'),
    'client_secret' => env('OPENPANEL_CLIENT_SECRET'),
    'queue' => env('OPENPANEL_QUEUE', 'default'),
    'queue_connection' => env('OPENPANEL_QUEUE_CONNECTION', 'sync'),
];

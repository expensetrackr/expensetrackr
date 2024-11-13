#!/usr/bin/env bash

php artisan down

php artisan inertia:stop-ssr

php artisan queue:restart

php artisan up

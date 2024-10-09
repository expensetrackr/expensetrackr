#!/usr/bin/env bash

php artisan down

php artisan inertia:stop-ssr

php artisan schedule:interrupt

php artisan up

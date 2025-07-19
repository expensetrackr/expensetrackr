#!/usr/bin/env bash

php artisan down

php artisan cache:clear

php artisan config:clear
php artisan config:cache

php artisan view:clear
php artisan view:cache

php artisan event:clear
php artisan event:cache

php artisan route:clear
php artisan route:cache

php artisan filament:clear-cached-components
php artisan filament:cache-components

php artisan migrate --force

php artisan inertia:stop-ssr

php artisan queue:restart

php artisan horizon:terminate

php artisan pulse:restart

php artisan make:sitemap

php artisan scribe:generate

php artisan up

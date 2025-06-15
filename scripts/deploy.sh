#!/usr/bin/env bash

php artisan down

php artisan cache:clear

php artisan config:clear

php artisan view:clear

php artisan event:clear

php artisan route:clear

php artisan filament:clear-cached-components
php artisan filament:cache-components

php artisan migrate --force

php artisan inertia:stop-ssr

php artisan queue:restart

php artisan make:sitemap

php artisan horizon:terminate

php artisan pulse:restart

php artisan up

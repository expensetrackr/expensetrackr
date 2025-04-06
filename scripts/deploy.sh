#!/usr/bin/env bash

php artisan down

php artisan cache:clear

php artisan config:clear

php artisan view:clear

php artisan event:clear

php artisan route:clear

php artisan filament:clear-cached-components
php artisan filament:cache-components

bun install --frozen-lockfile
bun run build

php artisan inertia:stop-ssr

php artisan queue:restart

php artisan up

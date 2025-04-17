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

php artisan up

# Install the cli
curl -sL https://sentry.io/get-cli/ | bash

# Setup configuration values
SENTRY_AUTH_TOKEN="${SENTRY_AUTH_TOKEN:?'SENTRY_AUTH_TOKEN environment variable is required'}"
SENTRY_ORG="${SENTRY_ORG:?'SENTRY_ORG environment variable is required'}"
SENTRY_PROJECT="${SENTRY_PROJECT:?'SENTRY_PROJECT environment variable is required'}"
VERSION=`sentry-cli releases propose-version`

# Workflow to create releases
sentry-cli releases new "$VERSION"
sentry-cli releases set-commits "$VERSION" --auto
sentry-cli releases finalize "$VERSION"

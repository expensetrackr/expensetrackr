#!/usr/bin/env bash

# Install the cli
curl -sL https://sentry.io/get-cli/ | sh

# Setup configuration values
SENTRY_AUTH_TOKEN="${SENTRY_AUTH_TOKEN:?'SENTRY_AUTH_TOKEN environment variable is required'}"
SENTRY_ORG="${SENTRY_ORG:?'SENTRY_ORG environment variable is required'}"
SENTRY_PROJECT="${SENTRY_PROJECT:?'SENTRY_PROJECT environment variable is required'}"
VERSION=`sentry-cli releases propose-version`

# Workflow to create releases
sentry-cli releases new "$VERSION"
sentry-cli releases set-commits "$VERSION" --auto
sentry-cli releases finalize "$VERSION"

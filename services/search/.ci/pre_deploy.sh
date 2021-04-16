#!/usr/bin/env bash
set -e pipefail

if [ "$POSTGRES_USER" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl secrets set \
    POSTGRES_USER="$POSTGRES_USER" \
    POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
    POSTGRES_HOST="$POSTGRES_HOST" \
    POSTGRES_DB="$POSTGRES_DATABASE" \
    || true

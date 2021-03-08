#!/usr/bin/env bash
set -e pipefail

if [ "$HASURA_FLY_POSTGRES_USER" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl secrets set \
    POSTGRES_USER="$HASURA_FLY_POSTGRES_USER" \
    POSTGRES_PASSWORD="$HASURA_FLY_POSTGRES_PASSWORD" \
    POSTGRES_HOST="$HASURA_FLY_POSTGRES_HOST" \
    POSTGRES_DB="$HASURA_FLY_POSTGRES_DB" \
    || true

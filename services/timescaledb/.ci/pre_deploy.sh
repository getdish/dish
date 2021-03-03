#!/usr/bin/env bash
set -e pipefail

echo $TIMESCALE_FLY_POSTGRES_USER

if [ "$TIMESCALE_FLY_POSTGRES_USER" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl postgres attach --postgres-app dish-db || true

flyctl secrets set \
    POSTGRES_USER="$TIMESCALE_FLY_POSTGRES_USER" \
    POSTGRES_PASSWORD="$TIMESCALE_FLY_POSTGRES_PASS" \
    POSTGRES_HOST="$TIMESCALE_FLY_POSTGRES_HOST" \
    POSTGRES_DB="$TIMESCALE_FLY_POSTGRES_DB" || true

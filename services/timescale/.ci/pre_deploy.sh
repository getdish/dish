#!/usr/bin/env bash
set -e pipefail

if [ "$TIMESCALE_FLY_POSTGRES_USER" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl secrets set \
    POSTGRES_USER="$TIMESCALE_FLY_POSTGRES_USER" \
    POSTGRES_PASSWORD="$TIMESCALE_FLY_POSTGRES_PASS" \
    POSTGRES_DB="$TIMESCALE_FLY_POSTGRES_DB" \
    TIMESCALEDB_TELEMETRY="off" \
    || true

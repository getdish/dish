#!/usr/bin/env bash
set -e pipefail

if [ "$TIMESCALE_USER" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl secrets set \
    POSTGRES_USER="$TIMESCALE_USER" \
    POSTGRES_PASSWORD="$TIMESCALE_PASS" \
    POSTGRES_DB="$TIMESCALE_DB" \
    TIMESCALEDB_TELEMETRY="off" \
    || true

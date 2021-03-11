#!/usr/bin/env bash
set -e pipefail

if [ "$TIMESCALE_ADMIN_EMAIL" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl secrets set \
    PGADMIN_DEFAULT_EMAIL="$TIMESCALE_ADMIN_EMAIL" \
    PGADMIN_DEFAULT_PASSWORD="$TIMESCALE_ADMIN_PASSWORD" \
    PGADMIN_LISTEN_ADDRESS="0.0.0.0" \
    || true

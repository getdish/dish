#!/usr/bin/env bash
set -e pipefail

if [ "$TILESERVER_FLY_POSTGRES_URL" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl postgres attach --postgres-app dish-db || true

flyctl secrets set \
    WATCH_MODE=true \
    DATABASE_URL="$TILESERVER_FLY_POSTGRES_URL"
    VIRTUAL_HOST="martin-tiles.dishapp.com" || true

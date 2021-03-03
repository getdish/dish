#!/usr/bin/env bash
set -e pipefail

if [ "$TILESERVER_FLY_POSTGRES_URL" = "" ]; then
    echo "missing env, may need to attach flyctl postgres attach --postgres-app dish-db"
    exit 1
fi

flyctl secrets set \
    WATCH_MODE=true \
    DATABASE_URL="$TILESERVER_FLY_POSTGRES_URL" \
    VIRTUAL_HOST="martin-tiles.dishapp.com" || true

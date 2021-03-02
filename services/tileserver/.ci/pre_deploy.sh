#!/usr/bin/env bash
set -e pipefail

flyctl secrets set \
    WATCH_MODE=true \
    DATABASE_URL="$TILESERVER_FLY_POSTGRES_URL"
    VIRTUAL_HOST="martin-tiles.dishapp.com" || true

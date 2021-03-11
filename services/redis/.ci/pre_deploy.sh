#!/usr/bin/env bash
set -e pipefail

if [ "$REDIS_PASSWORD" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl secrets set \
    REDIS_PASSWORD="$REDIS_PASSWORD" \
    || true

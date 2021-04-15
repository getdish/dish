#!/usr/bin/env bash
set -e pipefail

if [ "$DO_SPACES_ID" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl secrets set \
    IS_LIVE="1" \
    DO_SPACES_ID="$DO_SPACES_ID" \
    DO_SPACES_SECRET="$DO_SPACES_SECRET" \
    GORSE_ENDPOINT="$GORSE_ENDPOINT" \
    DISH_ENV="$DISH_ENV" \
    || true

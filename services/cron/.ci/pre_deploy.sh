#!/usr/bin/env bash
set -e pipefail

if [ "$POSTGRES_URL" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl secrets set \
    DISH_ENV="$DISH_ENV" \
    POSTGRES_URL="$POSTGRES_URL" \
    JWT_ADMIN_PASSWORD="$JWT_ADMIN_PASSWORD" \
    HASURA_ENDPOINT="$HASURA_ENDPOINT" \
    HASURA_GRAPHQL_ADMIN_SECRET="$HASURA_GRAPHQL_ADMIN_SECRET" \
    DO_SPACES_ID="$DO_SPACES_ID" \
    DO_SPACES_SECRET="$DO_SPACES_SECRET" \
    TIMESCALE_URL="$TIMESCALE_URL" \
    || true

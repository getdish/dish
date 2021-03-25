#!/usr/bin/env bash
set -e pipefail

if [ "$HASURA_FLY_POSTGRES_URL" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl secrets set \
    DISH_ENV="$DISH_ENV" \
    HASURA_FLY_POSTGRES_URL="$HASURA_FLY_POSTGRES_URL" \
    JWT_ADMIN_PASSWORD="$JWT_ADMIN_PASSWORD" \
    HASURA_ENDPOINT="http://dish-hasura.fly.dev" \
    HASURA_GRAPHQL_ADMIN_SECRET="$HASURA_GRAPHQL_ADMIN_SECRET" \
    DO_SPACES_ID="$DO_SPACES_ID" \
    DO_SPACES_SECRET="$DO_SPACES_SECRET" \
    TIMESCALE_FLY_POSTGRES_URL="$TIMESCALE_FLY_POSTGRES_URL" \
    || true

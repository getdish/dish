#!/usr/bin/env bash
set -e pipefail

if [ "$DO_SPACES_ID" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl secrets set \
    DO_SPACES_ID="$DO_SPACES_ID" \
    DO_SPACES_SECRET="$DO_SPACES_SECRET" \
    SENDGRID_API_KEY="$SENDGRID_API_KEY" \
    JWT_ADMIN_PASSWORD="$JWT_ADMIN_PASSWORD" \
    HASURA_ENDPOINT="http://dish-hasura.fly.dev" \
    HASURA_SECRET="$HASURA_GRAPHQL_ADMIN_SECRET" \
    SEARCH_ENDPOINT="http://dish-search.fly.dev" \
    REDIS_URL="$FLY_REDIS_CACHE_URL" \
    || true

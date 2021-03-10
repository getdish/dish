#!/usr/bin/env bash
set -e pipefail

if [ "$HASURA_FLY_POSTGRES_URL" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl secrets set \
    HASURA_GRAPHQL_DATABASE_URL="$HASURA_FLY_POSTGRES_URL" \
    HASURA_GRAPHQL_NO_OF_RETRIES="50" \
    HASURA_GRAPHQL_ENABLED_LOG_TYPES="startup, http-log, webhook-log, websocket-log, query-log" \
    HASURA_GRAPHQL_ENABLE_TELEMETRY="false" \
    HASURA_GRAPHQL_ADMIN_SECRET="${HASURA_GRAPHQL_ADMIN_SECRET:-password}" \
    HASURA_GRAPHQL_UNAUTHORIZED_ROLE="anon" \
    HASURA_GRAPHQL_JWT_SECRET="{\"type\":\"HS256\", \"key\":\"12345678901234567890123456789012\"}" \
    HASURA_GRAPHQL_ENABLE_CONSOLE="true" \
    DISH_HOOKS_ENDPOINT="http://dish-hooks.internal" \
    GORSE_SYNC_HOOK="http://dish-hooks.internal/gorse_sync" \
    VIRTUAL_HOST="dish-hasura.fly.dev" || true

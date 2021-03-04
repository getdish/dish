#!/usr/bin/env bash
set -e pipefail

if [ "$HASURA_FLY_POSTGRES_URL" = "" ]; then
    echo "missing env"
    exit 1
fi

echo "deploying with postgres url $HASURA_FLY_POSTGRES_URL"

# flyctl postgres attach --postgres-app dish-db || true

flyctl secrets set \
    HASURA_GRAPHQL_DATABASE_URL="$HASURA_FLY_POSTGRES_URL" \
    HASURA_GRAPHQL_NO_OF_RETRIES="300" \
    HASURA_GRAPHQL_ENABLED_LOG_TYPES="startup, http-log, webhook-log, websocket-log, query-log" \
    HASURA_GRAPHQL_ENABLE_TELEMETRY="false" \
    HASURA_GRAPHQL_ADMIN_SECRET="${TF_VAR_HASURA_GRAPHQL_ADMIN_SECRET:-password}" \
    HASURA_GRAPHQL_UNAUTHORIZED_ROLE="anon" \
    HASURA_GRAPHQL_JWT_SECRET="{\"type\":\"HS256\", \"key\":\"12345678901234567890123456789012\"}" \
    HASURA_GRAPHQL_ENABLE_CONSOLE="true" \
    DISH_HOOKS_ENDPOINT="http://dish-hooks:6154" \
    GORSE_SYNC_HOOK="http://dish-hooks:6154/gorse_sync" \
    VIRTUAL_HOST="dish-hasura.fly.dev" || true

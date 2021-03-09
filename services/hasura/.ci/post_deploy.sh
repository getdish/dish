#!/usr/bin/env bash
set -e pipefail

echo "post-deploy hasura..."

hasura_endpoint="https://dish-hasura.fly.dev"

echo "migrating..."
hasura --skip-update-check migrate apply \
  --endpoint $hasura_endpoint \
  --admin-secret "$HASURA_GRAPHQL_ADMIN_SECRET"

echo "apply metadata..."
hasura --skip-update-check metadata apply \
    --endpoint $hasura_endpoint \
    --admin-secret "$HASURA_GRAPHQL_ADMIN_SECRET"

# echo "apply functions..."
echo "TODO apply functions"
cat functions/*.sql | psql "$HASURA_FLY_POSTGRES_URL" --single-transaction

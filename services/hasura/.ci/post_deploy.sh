#!/usr/bin/env bash
set -e pipefail

echo "post-deploy hasura..."

echo "migrating..."
hasura --skip-update-check migrate apply \
  --endpoint "$HASURA_ENDPOINT" \
  --admin-secret "$HASURA_GRAPHQL_ADMIN_SECRET"

echo "apply metadata..."
hasura --skip-update-check metadata apply \
    --endpoint "$HASURA_ENDPOINT" \
    --admin-secret "$HASURA_GRAPHQL_ADMIN_SECRET"

# echo "apply functions..."
echo "TODO apply functions"
cat functions/*.sql | psql "$POSTGRES_URL" --single-transaction

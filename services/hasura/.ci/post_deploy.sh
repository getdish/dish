#!/usr/bin/env bash
set -e pipefail

hasura_endpoint="https://dish-hasura.fly.dev"
hasura --skip-update-check migrate apply \
  --endpoint $hasura_endpoint \
  --admin-secret $TF_VAR_HASURA_GRAPHQL_ADMIN_SECRET
hasura --skip-update-check metadata apply \
    --endpoint $hasura_endpoint \
    --admin-secret $TF_VAR_HASURA_GRAPHQL_ADMIN_SECRET
cat functions/*.sql | psql $HASURA_GRAPHQL_DATABASE_URL --single-transaction

#!/bin/bash

PROJECT_ROOT=$(git rev-parse --show-toplevel)

pushd $PROJECT_ROOT
HASURA_ADMIN=$(\
  grep 'HASURA_GRAPHQL_ADMIN_SECRET:' env.enc.production.yaml \
    | tail -n1 | cut -c 30- | tr -d '"'\
)
DISH_PG_PASS=$(\
  grep 'TF_VAR_POSTGRES_PASSWORD:' env.enc.production.yaml \
    | tail -n1 | cut -c 27- | tr -d '"'\
)
popd

pushd $PROJECT_ROOT/services/hasura
$(yarn global bin)/hasura migrate apply \
  --skip-update-check \
  --endpoint https://hasura.rio.dishapp.com \
  --admin-secret $HASURA_ADMIN

cat functions/*.sql | \
  PGPASSWORD=$DISH_PG_PASS psql \
    -p 15432 \
    -h localhost \
    -U postgres \
    -d dish \
    --single-transaction
popd

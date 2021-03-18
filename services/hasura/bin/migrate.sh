#!/bin/bash

#
#  maybe not used anywhere???
#  i think its in dishctl.sh now
#

PROJECT_ROOT=$(git rev-parse --show-toplevel)

pushd "$PROJECT_ROOT" || exit
  env $(cat .env.production | xargs) \
    export HASURA_HASURA_GRAPHQL_ADMIN_SECRETADMIN="$HASURA_GRAPHQL_ADMIN_SECRET" \
    export POSTGRES_PASSWORD="$POSTGRES_PASSWORD"
popd || exit

pushd $PROJECT_ROOT/services/hasura || exit
  $(yarn global bin)/hasura migrate apply \
    --skip-update-check \
    --endpoint https://hasura.dishapp.com \
    --admin-secret $HASURA_GRAPHQL_ADMIN_SECRET

  cat functions/*.sql | \
    PGPASSWORD=$POSTGRES_PASSWORD psql \
      -p 15432 \
      -h localhost \
      -U postgres \
      -d dish \
      --single-transaction
popd || exit

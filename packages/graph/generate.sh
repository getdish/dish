#!/bin/sh

set -e

PROJECT_ROOT=$(git rev-parse --show-toplevel)

pushd $PROJECT_ROOT
export HASURA_SECRET=$(\
  grep 'HASURA_GRAPHQL_ADMIN_SECRET:' env.enc.production.yaml \
    | tail -n1 | cut -c 30- | tr -d '"'\
)
popd

node generate.js

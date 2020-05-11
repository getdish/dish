#!/bin/sh

set -e

cd ../..
export HASURA_SECRET=$(\
  grep 'HASURA_GRAPHQL_ADMIN_SECRET:' env.enc.production.yaml \
    | tail -n1 | cut -c 30- | tr -d '"'\
)
cd -

node generate.js

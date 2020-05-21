#!/bin/sh

set -e

cd ../..
if [ ! -f env.enc.production.yaml ]; then
  echo "no env generated, exiting"
  exit 0
fi
export HASURA_SECRET=$(\
  grep 'HASURA_GRAPHQL_ADMIN_SECRET:' env.enc.production.yaml \
    | tail -n1 | cut -c 30- | tr -d '"'\
)
cd -

ts-node ./generate.ts

#!/usr/bin/env bash

set -eo pipefail

export DISH_ENV=test

set -a
source .env
source .env.test
set +a

# HELPERS

# branch=$(git rev-parse --abbrev-ref HEAD)
# export DISH_BASE_VERSION=:${branch//\//-}

is_hasura_up() {
  [ $(curl -L $HASURA_ENDPOINT/healthz -o /dev/null -w '%{http_code}\n' -s) == "200" ]
}
export -f is_hasura_up

is_dish_up() {
  [ $(curl -L $DISH_ENDPOINT/healthz -o /dev/null -w '%{http_code}\n' -s) == "200" ]
}
export -f is_dish_up

echo "HOME: $HOME, dish endpoint: $DISH_ENDPOINT"

wait_until_hasura_ready() {
  echo "Waiting for Hasura to start ($HASURA_ENDPOINT)..."
  until is_hasura_up; do sleep 0.1; done
  echo "Hasura is up"
}
export -f wait_until_hasura_ready

wait_until_dish_app_ready() {
  echo "Waiting for dish to start..."
  until is_dish_up; do sleep 0.1; done
  echo "dish is up"
}
export -f wait_until_dish_app_ready

# SCRIPT

mkdir -p "/data/postgresdb"
chown -R root:root "/data/postgresdb"
echo "POSTGRES_DB: $POSTGRES_DB"

echo "Starting docker for $DISH_ENV"

DB_DATA_DIR="/data/postgresdb/" \
./dishctl.sh docker_compose_up -d

echo "Waiting for hasura to finish starting"
if ! timeout --preserve-status 30 bash -c wait_until_hasura_ready; then
  echo "Timed out waiting for Hasura container to start"
  exit 1
fi

sleep 1 # bugfix let it finish setting up

echo "Migrating hasura"
./dishctl.sh db_migrate_init

echo "Migrating timescale"
cd services/timescale && npm install &> /dev/null || true && node ./scripts/migrate.js

echo "Waiting for dish-app to finish starting"
if ! timeout --preserve-status 30 bash -c wait_until_dish_app_ready; then
  echo "Timed out waiting for dish container to start"
  exit 1
fi

echo "done"

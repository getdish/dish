#!/usr/bin/env bash

set -exo pipefail

# HELPERS

branch=$(git rev-parse --abbrev-ref HEAD)
export DISH_BASE_VERSION=:${branch//\//-}

is_hasura_up() {
  [ $(curl -L $HASURA_ENDPOINT/healthz -o /dev/null -w '%{http_code}\n' -s) == "200" ]
}
export -f is_hasura_up

is_dish_up() {
  [ $(curl -L $DISH_ENDPOINT/healthz -o /dev/null -w '%{http_code}\n' -s) == "200" ]
}
export -f is_dish_up

echo "dish endpoint: $DISH_ENDPOINT"

wait_until_hasura_ready() {
  echo "Waiting for Hasura to start..."
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

mkdir -p $HOME/.dish/postgres/data

# Postgres needs 2 starts to get everything set up
docker-compose up -d postgres > postgres-init.logs
sleep 6
docker-compose down

echo "Starting docker for tests"
./dishctl.sh docker_compose_up_for_tests -d

echo "Migrating DB"
./dishctl.sh db_migrate_local init

echo "Migrating timescale"
docker run --net host $DISH_REGISTRY/base \
  bash -c 'cd services/timescaledb && DISH_ENV=not-production ./migrate.sh'

echo "Waiting for hasura to finish starting"
if ! timeout --preserve-status 20 bash -c wait_until_hasura_ready; then
  echo "Timed out waiting for Hasura container to start"
  exit 1
fi

echo "Waiting for dish-app to finish starting"
if ! timeout --preserve-status 60 bash -c wait_until_dish_app_ready; then
  echo "Timed out waiting for dish container to start"
  exit 1
fi


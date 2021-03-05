#!/usr/bin/env bash

set -eo pipefail

export DISH_IMAGE_TAG=":latest"

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

export POSTGRES_STRATEGY=simple

mkdir -p $HOME/.dish/postgres
chown -R root:root $HOME/.dish/postgres

# if not already mounted/setup, we need to start postgres once and stop it so it sets up
if [ ! -d $HOME/.dish/postgres/data ]; then
  # Postgres needs 2 starts to get everything set up
  docker-compose run -d postgres
  sleep 6
  docker-compose down -t 3
fi

echo "Starting docker for tests"
./dishctl.sh docker_compose_up_for_tests -d

echo "Waiting for hasura to finish starting"
if ! timeout --preserve-status 30 bash -c wait_until_hasura_ready; then
  echo "Timed out waiting for Hasura container to start"
  exit 1
fi

# let it finish setting up
sleep 2

echo "Migrating DB"
./dishctl.sh db_migrate_local init

echo "Migrating timescale"
docker run --net host $DISH_REGISTRY/base \
  bash -c 'cd services/timescaledb && DISH_ENV=not-production ./bin/migrate.sh'

echo "Waiting for dish-app to finish starting"
if ! timeout --preserve-status 30 bash -c wait_until_dish_app_ready; then
  echo "Timed out waiting for dish container to start"
  exit 1
fi


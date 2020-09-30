#!/usr/bin/env bash
set -e

branch=$(git rev-parse --abbrev-ref HEAD)
export DISH_BASE_VERSION=:${branch//\//-}

is_hasura_up() {
  [ $(curl -L $HASURA_ENDPOINT/healthz -o /dev/null -w '%{http_code}\n' -s) == "200" ]
}
export -f is_hasura_up

wait_until_hasura_ready() {
  echo "Waiting for Hasura to start..."
  until is_hasura_up; do sleep 0.1; done
  echo "Hasura is up"
}
export -f wait_until_hasura_ready

docker-compose --version

mkdir -p $HOME/.dish/postgres/data
docker-compose up -d postgres
sleep 10 # Postgres needs 2 starts to get everything set up
docker-compose down
docker-compose up -d hasura postgres timescaledb

./dishctl.sh db_migrate_local
./dishctl.sh timescale_migrate_local
# JWT server won't start until migrations have been applied
docker-compose down

# Exclude the base service, as that's just a dev convienience to build the base image
services=$(docker-compose config --services | grep -v base | tr '\r\n' ' ')
eval $(./dishctl.sh yaml_to_env) docker-compose up -d $services

if ! timeout --preserve-status 20 bash -c wait_until_hasura_ready; then
  echo "Timed out waiting for Hasura container to start"
  exit 1
fi


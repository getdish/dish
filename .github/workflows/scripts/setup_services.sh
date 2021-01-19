#!/usr/bin/env bash
set -e
set -x

branch=$(git rev-parse --abbrev-ref HEAD)
export DISH_BASE_VERSION=:${branch//\//-}
export DISH_IMAGE_TAG=latest

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
./dishctl.sh ci_rename_tagged_images_to_latest

mkdir -p $HOME/.dish/postgres/data
docker-compose up -d postgres
sleep 10 # Postgres needs 2 starts to get everything set up
docker-compose down
./dishctl.sh docker_compose_up_for_tests -d

./dishctl.sh db_migrate_local init
docker run --net host $DISH_REGISTRY/base \
  bash -c 'cd services/timescaledb && DISH_ENV=not-production ./migrate.sh'

if ! timeout --preserve-status 20 bash -c wait_until_hasura_ready; then
  echo "Timed out waiting for Hasura container to start"
  exit 1
fi


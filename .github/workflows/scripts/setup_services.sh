#!/usr/bin/env bash
set -e

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

mkdir -p $HOME/.dish/postgres/data
docker-compose up -d
sleep 10 # Postgres needs 2 starts to get everything set up
docker-compose down
docker-compose up -d

pushd services/hasura
curl -L https://github.com/hasura/graphql-engine/raw/master/cli/get.sh | bash
hasura migrate apply --endpoint $HASURA_ENDPOINT --admin-secret password
popd

# JWT server won't start until migrations have been applied
docker-compose down
docker-compose up -d

if ! timeout --preserve-status 20 bash -c wait_until_hasura_ready; then
  echo "Timed out waiting for Hasura container to start"
  exit 1
fi


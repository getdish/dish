#!/usr/bin/env bash

echo "Outputting CI logs..."

pushd services/hasura
docker-compose logs
popd

docker logs dish-app-for-integration-tests

cat *.logs || true


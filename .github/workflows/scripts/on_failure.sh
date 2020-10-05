#!/usr/bin/env bash

echo "Outputting CI logs..."

pushd services/hasura
docker-compose logs
popd

cat *.logs || true


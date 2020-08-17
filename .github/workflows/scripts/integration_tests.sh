#!/usr/bin/env bash
set -e

echo "Running Test Cafe end-to-end browser-based tests..."

pushd apps/web
docker run -d --net=host $DISH_REGISTRY/dish/web
sleep 5
./test/testcafe.sh
popd

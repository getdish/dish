#!/usr/bin/env bash
set -ex

echo "Running Test Cafe end-to-end browser-based tests..."

pushd dish-app
docker run -d --net=host --name dish-app-for-integration-tests $DISH_REGISTRY/dish-app
sleep 5
./test/testcafe.sh
popd

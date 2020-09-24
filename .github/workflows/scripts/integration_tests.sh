#!/usr/bin/env bash
set -e

echo "Running Test Cafe end-to-end browser-based tests..."

pushd dish-app
docker run -d --net=host $DISH_REGISTRY/dish/dish-app
sleep 5
./test/testcafe.sh
popd

#!/usr/bin/env bash
set -ex

echo "Running Test Cafe end-to-end browser-based tests..."

pushd dish-app
  docker run -d --net=host --name dish-app-integration-tests-$BUILDKITE_BUILD_NUMBER $DISH_REGISTRY/dish-app
sleep 5
./test/testcafe.sh
popd

#!/usr/bin/env bash
set -e

echo "Running Test Cafe end-to-end browser-based tests..."
yarn global add testcafe #TODO use version from package.json

pushd dish-app
docker run -d --net=host --name dish-app-for-integration-tests $DISH_REGISTRY/dish/dish-app
sleep 5
./test/testcafe.sh
popd

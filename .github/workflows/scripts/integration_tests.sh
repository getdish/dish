#!/usr/bin/env bash
set -e

echo "Running Test Cafe end-to-end browser-based tests..."

 #TODO use version from package.json
 #TODO bug for some reason it wants global snackui babel plugin
yarn global add testcafe

pushd dish-app
docker run -d --net=host --name dish-app-for-integration-tests $DISH_REGISTRY/dish-app
sleep 5
./test/testcafe.sh
popd

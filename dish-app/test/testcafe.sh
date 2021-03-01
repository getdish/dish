#!/bin/bash
set -e

PROJECT_ROOT=$(git rev-parse --show-toplevel)

pushd $PROJECT_ROOT/dish-app

export NODE_ENV=test

docker run -v $PROJECT_ROOT/dish-app/test:/tests -it testcafe/testcafe "chromium:headless" \
  --skip-js-errors \
  --screenshots $PROJECT_ROOT/dish-app/test/screenshots \
  --screenshots-on-fails

popd

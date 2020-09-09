#!/bin/bash
set -e

PROJECT_ROOT=$(git rev-parse --show-toplevel)

pushd $PROJECT_ROOT/apps/dish-app
./node_modules/.bin/testcafe \
  chrome:headless \
  --skip-js-errors \
  --screenshots $PROJECT_ROOT/apps/dish-app/test/screenshots \
  --screenshots-on-fails \
  test
popd

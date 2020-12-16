#!/bin/bash
set -e

PROJECT_ROOT=$(git rev-parse --show-toplevel)

pushd $PROJECT_ROOT/dish-app
yarn testcafe \
  chrome:headless \
  --skip-js-errors \
  --screenshots $PROJECT_ROOT/dish-app/test/screenshots \
  --screenshots-on-fails \
  test
popd

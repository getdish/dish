#!/bin/bash
set -e

testcafe_bin=../node_modules/.bin/testcafe

PROJECT_ROOT=$(git rev-parse --show-toplevel)

pushd $PROJECT_ROOT/dish-app

export NODE_ENV=test

$testcafe_bin \
  chrome:headless \
  --skip-js-errors \
  --screenshots $PROJECT_ROOT/dish-app/test/screenshots \
  --screenshots-on-fails \
  test
popd

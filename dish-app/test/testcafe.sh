#!/bin/bash
set -e

testcafe_bin=$(yarn global bin)/testcafe

if ! [ -f "$testcafe_bin" ]; then
  testcafe_bin=./node_modules/.bin/testcafe
fi

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

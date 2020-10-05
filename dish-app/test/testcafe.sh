#!/bin/bash
set -e

PROJECT_ROOT=$(git rev-parse --show-toplevel)

testcafe_bin=$(yarn global bin)/testcafe

if ! [ -f "$testcafe_bin" ]; then
  testcafe_bin=./node_modules/.bin/testcafe
fi

pushd $PROJECT_ROOT/dish-app
$testcafe_bin \
  chrome:headless \
  --skip-js-errors \
  --screenshots $PROJECT_ROOT/dish-app/test/screenshots \
  --screenshots-on-fails \
  test
popd

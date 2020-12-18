#!/bin/bash
set -e

testcafe_bin=$(yarn global bin)/testcafe

if ! [ -f "$testcafe_bin" ]; then
  testcafe_bin=./node_modules/.bin/testcafe
fi

PROJECT_ROOT=$(git rev-parse --show-toplevel)

pushd $PROJECT_ROOT/dish-app

echo "where"
ls -la node_modules/@snackui || true
echo "where2"
ls -la ../node_modules/@snackui || true
echo "test installing it then..."
yarn install @snackui/babel-plugin

$testcafe_bin \
  chrome:headless \
  --skip-js-errors \
  --screenshots $PROJECT_ROOT/dish-app/test/screenshots \
  --screenshots-on-fails \
  test
popd

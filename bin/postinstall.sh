#!/bin/bash
set -e

PROJECT_ROOT="$(dirname "$0")/.."

pushd $PROJECT_ROOT/dish-app
yarn patch-package
popd
pushd $PROJECT_ROOT/node_modules
rm -r react-native || true
rm -r react || true
rm -r react-dom || true
rm -r react-native-svg || true
rm -r react-native-web || true
ln -s ../dish-app/node_modules/react-native .
ln -s ../dish-app/node_modules/react .
ln -s ../dish-app/node_modules/react-dom .
ln -s ../dish-app/node_modules/react-native-svg .
ln -s ../dish-app/node_modules/react-native-web .
yarn build:refs
yarn expo:check-deps
popd


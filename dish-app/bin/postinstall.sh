#!/bin/bash
set -e

PROJECT_ROOT="$(dirname "$0")/../.."

pushd $PROJECT_ROOT/dish-app
yarn patch-package
popd
pushd $PROJECT_ROOT
rm -r ./node_modules/react-native || true
rm -r ./node_modules/react || true
rm -r ./node_modules/react-dom || true
rm -r ./node_modules/react-native-svg || true
rm -r ./node_modules/react-native-web || true
if [ -n "$DOCKER_BUILD" ] ; then
  mv $(realpath ./dish-app/node_modules/react-native) ./node_modules
  mv $(realpath ./dish-app/node_modules/react) ./node_modules
  mv $(realpath ./dish-app/node_modules/react-dom) ./node_modules
  mv $(realpath ./dish-app/node_modules/react-native-svg) ./node_modules
  mv $(realpath ./dish-app/node_modules/react-native-web) ./node_modules
elif
  ln -s $(realpath ./dish-app/node_modules/react-native) ./node_modules
  ln -s $(realpath ./dish-app/node_modules/react) ./node_modules
  ln -s $(realpath ./dish-app/node_modules/react-dom) ./node_modules
  ln -s $(realpath ./dish-app/node_modules/react-native-svg) ./node_modules
  ln -s $(realpath ./dish-app/node_modules/react-native-web) ./node_modules
fi
yarn build:refs
yarn expo:check-deps
popd


#!/bin/bash
set -e

pushd "$(dirname "$0")/.."
yarn patch-package

if [ "$DISH_LINK_RN_MODULES" != "false" ]; then
  (cd dish-app && yarn patch-package)
  rm -r ./node_modules/react-native || true
  rm -r ./node_modules/react || true
  rm -r ./node_modules/react-dom || true
  rm -r ./node_modules/react-native-svg || true
  ln -s $(realpath ./dish-app/node_modules/react-native) ./node_modules
  ln -s $(realpath ./dish-app/node_modules/react) ./node_modules
  ln -s $(realpath ./dish-app/node_modules/react-dom) ./node_modules
  ln -s $(realpath ./dish-app/node_modules/react-native-svg) ./node_modules
  yarn build:refs
  yarn expo:check-deps
fi

popd

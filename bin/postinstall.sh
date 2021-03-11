#!/bin/bash
set -e

function patch_app_packages() {
  pushd $PROJECT_ROOT/dish-app
  yarn patch-package || true
  popd
}

function delete_extra_dish_app_modules() {
  pushd $PROJECT_ROOT/dish-app/node_modules
  rm -r lodash || true
  popd
}

function delete_and_link_duplicate_modules() {
  pushd $PROJECT_ROOT/node_modules
  rm -r react-native || true
  rm -r react || true
  rm -r react-dom || true
  rm -r react-native-svg || true
  rm -r react-native-web || true
  ln -s ../dish-app/node_modules/typescript . || true
  ln -s ../dish-app/node_modules/react-native . || true
  ln -s ../dish-app/node_modules/react . || true
  ln -s ../dish-app/node_modules/react-dom . || true
  ln -s ../dish-app/node_modules/react-native-svg . || true
  ln -s ../dish-app/node_modules/react-native-web . || true
  popd
}

PROJECT_ROOT="$(dirname "$0")/.."
delete_extra_dish_app_modules &
delete_and_link_duplicate_modules &
yarn patch-package || true &
patch_app_packages &
# yarn expo:check-deps &
wait

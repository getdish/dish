#!/bin/bash
set -e

function patch_packages() {
  pushd $PROJECT_ROOT/dish-app
  yarn patch-package
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
  ln -s ../dish-app/node_modules/react-native .
  ln -s ../dish-app/node_modules/react .
  ln -s ../dish-app/node_modules/react-dom .
  ln -s ../dish-app/node_modules/react-native-svg .
  ln -s ../dish-app/node_modules/react-native-web .
  popd
}

function delete_duplicate_snack_modules() {
  pushd $PROJECT_ROOT
  rm -r snackui/examples/nextjs/node_modules/react || true
  rm -r snackui/examples/nextjs/node_modules/react-dom || true
  rm -r snackui/node_modules/@babel/types || true # fix babel single version
  rm -r snackui/node_modules/@o || true
  rm -r snackui/node_modules/@types/react || true
  rm -r snackui/node_modules/@types/react-dom || true
  rm -r snackui/node_modules/react || true
  rm -r snackui/node_modules/react-dom || true
  rm -r snackui/node_modules/react-native-web || true
  rm -r snackui/packages/snackui-static/node_modules/snackui || true # fix dup install
  popd
}

PROJECT_ROOT="$(dirname "$0")/.."
delete_extra_dish_app_modules &
delete_and_link_duplicate_modules &
delete_duplicate_snack_modules &
patch_packages &
# yarn build:refs &
yarn expo:check-deps &
wait

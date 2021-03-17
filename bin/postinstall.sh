#!/bin/bash
set -e

function patch_app_packages() {
  pushd $PROJECT_ROOT/dish-app
  echo "dish-app yarn postinstall"
  yarn postinstall || true
  popd
}

function delete_and_link_duplicate_modules() {
  pushd $PROJECT_ROOT/node_modules
  rm -r react-native &> /dev/null || true
  rm -r react &> /dev/null || true
  rm -r react-dom &> /dev/null || true
  rm -r react-native-svg &> /dev/null || true
  ln -s ../dish-app/node_modules/typescript . &> /dev/null || true
  ln -s ../dish-app/node_modules/react-native . &> /dev/null || true
  ln -s ../dish-app/node_modules/react . &> /dev/null || true
  ln -s ../dish-app/node_modules/react-dom . &> /dev/null || true
  ln -s ../dish-app/node_modules/react-native-svg . &> /dev/null || true
  popd
}

function delete_duplicate_snack_modules() {
  pushd $PROJECT_ROOT
  rm -r snackui/examples/nextjs/node_modules/react &> /dev/null || true
  rm -r snackui/examples/nextjs/node_modules/react-dom &> /dev/null || true
  rm -r snackui/node_modules/@babel/types &> /dev/null || true # fix babel single version
  rm -r snackui/node_modules/@o &> /dev/null || true
  rm -r snackui/node_modules/@dish &> /dev/null || true
  rm -r snackui/node_modules/@types/react &> /dev/null || true
  rm -r snackui/node_modules/@types/react-dom &> /dev/null || true
  rm -r snackui/node_modules/react &> /dev/null || true
  rm -r snackui/node_modules/react-dom &> /dev/null || true
  rm -r snackui/node_modules/react-native-web &> /dev/null || true
  rm -r snackui/packages/snackui-static/node_modules/snackui &> /dev/null || true # fix dup install
  popd
}

PROJECT_ROOT="$(dirname "$0")/.."
delete_duplicate_snack_modules &
delete_and_link_duplicate_modules &
yarn patch-package || true &
patch_app_packages &
wait

echo "to use snackui/website or site, be sure to use npm NOT yarn"
echo "this is to keep cache clean"

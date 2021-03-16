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
  rm -r react-native || true
  rm -r react || true
  rm -r react-dom || true
  rm -r react-native-svg || true
  ln -s ../dish-app/node_modules/typescript . || true
  ln -s ../dish-app/node_modules/react-native . || true
  ln -s ../dish-app/node_modules/react . || true
  ln -s ../dish-app/node_modules/react-dom . || true
  ln -s ../dish-app/node_modules/react-native-svg . || true
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
delete_duplicate_snack_modules &
delete_and_link_duplicate_modules &
yarn patch-package || true &
patch_app_packages &
wait

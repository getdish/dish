#!/bin/bash
set -e

function patch_app_packages() {
  pushd $PROJECT_ROOT/dish-app
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

PROJECT_ROOT="$(dirname "$0")/.."
delete_and_link_duplicate_modules &
yarn patch-package || true &
patch_app_packages &
wait

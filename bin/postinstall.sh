#!/bin/bash
set -e

function patch_app_packages() {
  pushd $PROJECT_ROOT/dish-app
  echo "dish-app: yarn postinstall"
  yarn postinstall || true
  popd
}

function delete_and_link_duplicate_modules() {
  pushd $PROJECT_ROOT
  # now delete then symlink
  rm -r dish-app/node_modules/esbuild-register &> /dev/null || true
  rm -r node_modules/react-native &> /dev/null || true
  rm -r node_modules/react &> /dev/null || true
  rm -r node_modules/react-dom &> /dev/null || true
  rm -r node_modules/react-native-svg &> /dev/null || true
  ln -s ../dish-app/node_modules/typescript node_modules &> /dev/null || true
  ln -s ../dish-app/node_modules/react-native node_modules &> /dev/null || true
  ln -s ../dish-app/node_modules/react node_modules &> /dev/null || true
  ln -s ../dish-app/node_modules/react-dom node_modules &> /dev/null || true
  ln -s ../dish-app/node_modules/react-native-svg node_modules &> /dev/null || true
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
  rm -r snackui/node_modules/esbuild-register &> /dev/null || true
  rm -r snackui/packages/snackui-static/node_modules/snackui &> /dev/null || true # fix dup install
  popd
}

PROJECT_ROOT="$(dirname "$0")/.."
delete_duplicate_snack_modules &
delete_and_link_duplicate_modules &
yarn patch-package || true &
patch_app_packages &
wait

if [ -n "$EAS_BUILD" ]; then
  echo "eas build projects..."
  yarn build
fi

#!/bin/bash
set -e

function patch_app_packages() {
  pushd $PROJECT_ROOT/app
  echo "app: yarn postinstall"
  yarn postinstall || true
  popd
}

# function delete_and_link_duplicate_modules() {
#   pushd $PROJECT_ROOT
#   # now delete then symlink
#   rm -r app/node_modules/esbuild-register &> /dev/null || true
#   rm -r node_modules/react-native &> /dev/null || true
#   rm -r node_modules/react &> /dev/null || true
#   rm -r node_modules/react-dom &> /dev/null || true
#   rm -r node_modules/react-native-svg &> /dev/null || true
#   rm -r node_modules/react-native-safe-area-context &> /dev/null || true
#   ln -s ../app/node_modules/typescript node_modules &> /dev/null || true
#   ln -s ../app/node_modules/react-native node_modules &> /dev/null || true
#   ln -s ../app/node_modules/react node_modules &> /dev/null || true
#   ln -s ../app/node_modules/react-dom node_modules &> /dev/null || true
#   ln -s ../app/node_modules/react-native-svg node_modules &> /dev/null || true
#   ln -s ../app/node_modules/react-native-safe-area-context node_modules &> /dev/null || true
#   popd
# }

PROJECT_ROOT="$(dirname "$0")/.."
# delete_and_link_duplicate_modules &
yarn patch-package || true &
patch_app_packages &
wait

if [ -n "$EAS_BUILD" ]; then
  echo "eas build projects..."
  yarn build
fi

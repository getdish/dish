#!/bin/bash
set -e

PROJECT_ROOT="$(dirname "$0")/.."

pushd $PROJECT_ROOT
# we will use dish-app react-native instead, see postinstall.sh
# run this before install to prevent yarn getting confused
rm -r ./node_modules/react-native || true
rm -r ./node_modules/react || true
rm -r ./node_modules/react-dom || true
popd

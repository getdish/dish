#!/bin/bash

set -e
cd "$(dirname "$0")/.."

# we will use dish-app react-native instead, see postinstall.sh
# run this before install to prevent yarn getting confused

rm -r ./node_modules/react-native || true
rm -r ./node_modules/react || true
rm -r ./node_modules/react-dom || true

#!/bin/bash
set -e

cd "$(dirname "$0")/.."

rm -r ./node_modules/react-native || true
rm -r ./node_modules/react || true
rm -r ./node_modules/react-dom || true
ln -s $(realpath ./apps/dish-app/node_modules/react-native) ./node_modules
ln -s $(realpath ./apps/dish-app/node_modules/react) ./node_modules
ln -s $(realpath ./apps/dish-app/node_modules/react-dom) ./node_modules

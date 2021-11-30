#!/bin/bash

# for local dev with metro

PROJECT_ROOT="$(dirname "$0")/.."

pushd "$PROJECT_ROOT" || exit

echo "copying"

cp -r ~/tamagui/packages/tamagui ./node_modules
cp -r ~/tamagui/packages/core ./node_modules/@tamagui
cp -r ~/tamagui/packages/helpers ./node_modules/@tamagui
cp -r ~/tamagui/packages/colors ./node_modules/@tamagui
cp -r ~/tamagui/packages/feather-icons ./node_modules/@tamagui
cp -r ~/tamagui/packages/use-debounce ./node_modules/@tamagui
cp -r ~/tamagui/packages/use-window-size ./node_modules/@tamagui
cp -r ~/tamagui/packages/use-force-update ./node_modules/@tamagui

popd || exit

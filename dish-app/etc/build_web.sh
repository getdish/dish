#!/bin/bash
set -e

export NODE_ENV=production

rm -rf build build-legacy build-ssr

yarn build:output
yarn build:web:client
yarn build:web:client:legacy
yarn build:web:ssr

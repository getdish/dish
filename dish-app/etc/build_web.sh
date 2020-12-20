#!/bin/bash
set -e

export NODE_ENV=production

rm -rf web-build web-build-legacy web-build-ssr

yarn build:output
yarn build:web:client
yarn build:web:client:legacy
yarn build:web:ssr

#!/bin/bash
set -e

export NODE_ENV=production

yarn tsc -p tsconfig.build.json
yarn build
yarn build:web:client &
yarn build:web:client:legacy &
yarn build:web:ssr &
wait

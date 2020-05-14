#!/bin/bash
set -e

export NODE_ENV=production

yarn tsc -b tsconfig.build.json
yarn build

parallel --halt now,fail=1 'bash -c {}' ::: \
  'yarn build:web:client' \
  'yarn build:web:server'


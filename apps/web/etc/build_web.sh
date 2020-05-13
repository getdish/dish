#!/bin/bash
set -e

export NODE_ENV=production

yarn tsc -b tsconfig.build.json
yarn build
yarn build:web:client
yarn build:web:server

# TODO: A speed gain here would be nice, but it seems some "stream" conflicts
# between them: when one deletes its stream the other complains.
#parallel --halt now,fail=1 'bash -c {}' ::: \
  #'yarn build:web:client' \
  #'yarn build:web:server'


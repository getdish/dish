#!/bin/bash
set -e

export NODE_ENV=production

yarn build:output
yarn build:web:client &
yarn build:web:client:legacy &
yarn build:web:ssr &
wait

#!/bin/bash

export DISH_DEBUG=1

if [ "$1" == "--one" ]; then
  eval $(../../dishctl.sh yaml_to_env) \
    DISH_ENV="$DISH_ENV" NODE_ENV="$NODE_ENV" \
    node -r esbuild-register ./scripts/crawl_one.ts "$2"
fi

if [ "$1" == "--one-internal" ]; then
  eval $(../../dishctl.sh yaml_to_env) \
    DISH_ENV="$DISH_ENV" NODE_ENV="$NODE_ENV" \
    node -r esbuild-register ./scripts/crawl_one_internal.ts "$2"
fi

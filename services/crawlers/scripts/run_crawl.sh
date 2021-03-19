#!/bin/bash

export DISH_DEBUG=1

../../dishctl.sh source_env

if [ "$1" == "--one" ]; then
  node -r esbuild-register ./scripts/crawl_one.ts "$2"
fi

if [ "$1" == "--one-internal" ]; then
  node -r esbuild-register ./scripts/crawl_one_internal.ts "$2"
fi

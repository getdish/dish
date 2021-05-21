#!/bin/bash

export DISH_DEBUG=1

if [ "$1" == "--one" ]; then
  ../../dsh run "node -r esbuild-register ./scripts/crawl_one.ts $2"
fi

if [ "$1" == "--one-internal" ]; then
  ../../dsh run "node -r esbuild-register ./scripts/crawl_one_internal.ts $2"
fi

#!/bin/bash

if [ "$1" == "--one" ]; then
  eval $(../../dishctl.sh yaml_to_env) \
    node -r esbuild-register ./scripts/crawl_one.ts "$2"
fi

#!/bin/bash
set -e

export CLEAR_JOBS

eval $(../../dishctl.sh yaml_to_env) \
  NODE_ENV=development \
  DISH_ENV=development \
  REDIS_PASSWORD= node \
  dist/index.js

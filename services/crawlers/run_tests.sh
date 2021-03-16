#!/bin/bash
set -e

eval $(../../dishctl.sh yaml_to_env) \
  NODE_ENV=development \
  TARGET=node \
  RUN_WITHOUT_WORKER=true \
  DISH_ENV=test \
  ava test/idempotent/* --verbose --serial

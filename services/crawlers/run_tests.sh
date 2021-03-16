#!/bin/bash
set -e

eval $(../../dishctl.sh yaml_to_env) \
  NODE_ENV=test \
  TARGET=node \
  RUN_WITHOUT_WORKER=true \
  DISH_ENV=test \
  POSTGRES_DB=test \
  ava test/idempotent/* --verbose --serial

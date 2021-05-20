#!/bin/bash
set -e

export TARGET=node

pushd ../..
  set -a
  source .env
  source .env.test
  set +a
popd

ava test/idempotent/* --verbose --serial "$@"
ava test/http-dependent/* --verbose --serial "$@"
# ava test/http-dependent/yelp.ts --verbose --serial "$@"

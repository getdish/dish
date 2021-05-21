#!/bin/bash
set -e

export TARGET=node

pushd ../..
  set -a
  source .env
  source .env.test
  set +a
popd

ava test/idempotent/self.ts --match 'Review naive sentiments'

# ava test/idempotent/* --verbose --serial "$@"
# ava test/http-dependent/* --verbose --serial "$@"

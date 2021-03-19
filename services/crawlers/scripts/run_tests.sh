#!/bin/bash
set -e

export TARGET=node

pushd ../..
  set -a
  source .env.test
  set +a
popd

ava test/idempotent/* --verbose --serial "$@"

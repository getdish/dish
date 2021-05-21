#!/bin/bash
set -e

export TARGET=node

pushd ../..
  source .env
  source .env.test
popd

ava test/idempotent/* --verbose --serial "$@"
ava test/http-dependent/* --verbose --serial "$@"

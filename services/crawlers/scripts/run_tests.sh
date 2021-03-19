#!/bin/bash
set -e

export TARGET=node

set -a
source ../../.env.test
set +a

ava test/idempotent/* --verbose --serial "$@"

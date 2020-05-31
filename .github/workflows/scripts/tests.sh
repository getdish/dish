#!/usr/bin/env bash
set -e

yarn tsc --version # helps debugging
yarn ultra -r --no-pretty build
yarn ultra -r --no-pretty --serial test

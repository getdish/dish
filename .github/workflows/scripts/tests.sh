#!/usr/bin/env bash
set -e

yarn ultra -r --no-pretty build
yarn ultra -r --no-pretty --serial test

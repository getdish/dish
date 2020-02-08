#!/bin/bash

PROJECT_ROOT=$(git rev-parse --show-toplevel)

find $PROJECT_ROOT -name "node_modules" -type d -prune -exec rm -rf '{}' \;
find $PROJECT_ROOT -name "_" -type d -prune -exec rm -rf '{}' \;
find $PROJECT_ROOT -name "tsconfig.tsbuildinfo" -prune -exec rm -rf '{}' \;

#!/usr/bin/env bash
set -e

node_modules/.bin/prettier --check "**/*.ts"
node_modules/.bin/prettier --check "**/*.tsx"

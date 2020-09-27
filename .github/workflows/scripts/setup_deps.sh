#!/usr/bin/env bash
set -e

yarn --version
yarn install
yarn tsc --version # helps debugging
yarn ultra -r --no-pretty build

./.github/workflows/scripts/decrypt_creds.sh
./.github/workflows/scripts/setup_admin.sh

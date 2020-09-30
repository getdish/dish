#!/usr/bin/env bash
set -e

yarn --version
yarn install
yarn tsc --version # helps debugging
yarn ultra -r --no-pretty build
yarn global add hasura-cli@v1.2.2

./.github/workflows/scripts/decrypt_creds.sh
./.github/workflows/scripts/setup_admin.sh

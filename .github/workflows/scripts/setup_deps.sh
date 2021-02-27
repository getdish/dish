#!/usr/bin/env bash
set -e

npm i -g yarn
yarn global add hasura-cli@v1.2.2

./.github/workflows/scripts/decrypt_creds.sh
./.github/workflows/scripts/setup_admin.sh

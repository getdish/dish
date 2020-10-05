#!/usr/bin/env bash
set -e

yarn global add hasura-cli@v1.2.2
yarn global add https://github.com/getdish/postgrator-cli

./.github/workflows/scripts/decrypt_creds.sh
./.github/workflows/scripts/setup_admin.sh

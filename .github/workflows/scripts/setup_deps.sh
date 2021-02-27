#!/usr/bin/env bash
set -e

curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash

./.github/workflows/scripts/decrypt_creds.sh
./.github/workflows/scripts/setup_admin.sh

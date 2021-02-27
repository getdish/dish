#!/usr/bin/env bash
set -e

apt-get install -y docker docker-compose nodejs npm yarn

curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash

./.github/workflows/scripts/decrypt_creds.sh
./.github/workflows/scripts/setup_admin.sh

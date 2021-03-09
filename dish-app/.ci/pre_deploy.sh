#!/usr/bin/env bash
set -e pipefail

if [ "$TF_VAR_DO_SPACES_ID" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl secrets set \
    TF_VAR_DO_SPACES_ID="$DO_SPACES_ID" \
    TF_VAR_DO_SPACES_SECRET="$DO_SPACES_SECRET" \
    HASURA_ENDPOINT="http://dish-hasura.internal" \
    || true

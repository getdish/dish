#!/usr/bin/env bash
set -e pipefail

if [ "$HASURA_FLY_POSTGRES_URL" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl secrets set \
    HASURA_FLY_POSTGRES_URL="$HASURA_FLY_POSTGRES_URL" \
    TF_VAR_DO_SPACES_ID="$TF_VAR_DO_SPACES_ID" \
    TF_VAR_DO_SPACES_SECRET="$TF_VAR_DO_SPACES_SECRET" \
    TIMESCALE_FLY_POSTGRES_URL="$TIMESCALE_FLY_POSTGRES_URL" \
    || true

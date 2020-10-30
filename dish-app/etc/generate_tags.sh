#!/bin/bash
set -e

eval $(../dishctl.sh yaml_to_env)

export HASURA_ENDPOINT=https://hasura.dishapp.com
export HASURA_SECRET="$TF_VAR_HASURA_GRAPHQL_ADMIN_SECRET"

IS_LIVE=1 ts-node --transpile-only ./etc/generate_tags.ts

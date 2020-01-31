#!/usr/bin/env bash

eval $(../bin/yaml_to_env.sh)
terraform init -backend-config "access_key=$TF_VAR_DO_SPACES_ID" -backend-config "secret_key=$TF_VAR_DO_SPACES_SECRET"

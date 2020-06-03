#!/usr/bin/env bash

eval $(../bin/yaml_to_env.sh)

echo "Listing DO Dish bucket to see if we can access our stored Terraform state..."
s3cmd \
  --host sfo2.digitaloceanspaces.com \
  --host-bucket '%(bucket).sfo2.digitaloceanspaces.com' \
  --access_key $TF_VAR_DO_SPACES_ID \
  --secret_key $TF_VAR_DO_SPACES_SECRET \
  ls s3://dish-etc

echo "Attempting to init Terraform..."
terraform init \
  -backend-config "access_key=$TF_VAR_DO_SPACES_ID" \
  -backend-config "secret_key=$TF_VAR_DO_SPACES_SECRET"

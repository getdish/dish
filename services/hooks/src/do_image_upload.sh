#!/bin/sh
set -e

curl -L $1 | s3cmd \
  --host sfo2.digitaloceanspaces.com \
  --host-bucket '%(bucket).sfo2.digitaloceanspaces.com' \
  --access_key "$DO_SPACES_ID" \
  --secret_key "$DO_SPACES_SECRET" \
  --acl-public \
  --mime-type="$3" \
  --human-readable-sizes \
  put - s3://dish-images/$2

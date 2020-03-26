#!/bin/bash
set -e

DUMP_FILE_NAME="dish-db-backup-`date +%Y-%m-%d-%H-%M`.dump"

PGPASSWORD=$DB_PASSWORD pg_dump \
  -U postgres \
  -h postgres-postgresql.postgres \
  -p 5432 \
  -d dish \
  -C -w --format=c | \
  s3cmd \
    --host sfo2.digitaloceanspaces.com \
    --host-bucket '%(bucket).sfo2.digitaloceanspaces.com' \
    --access_key $DO_SPACES_API_ID \
    --secret_key $DO_SPACES_API_SECRET \
    put - s3://dish-backups/$DUMP_FILE_NAME

echo 'Successfully Backed Up'

#!/bin/bash

function migrate_all() {
  wait_until_services_ready
  echo "services ready"
  migrate_hasura
  echo "migrated hasura"
  migrate_timescale
  echo "migrated timescale"
  migrate_umami
  echo "migrated umami"
}

function psql_main() {
  if command -v pgcli &>/dev/null; then
    command="pgcli"
  else
    command="psql"
  fi
  PGPASSWORD="$POSTGRES_PASSWORD" log_command $command \
    -d "$POSTGRES_DB" \
    -U "$POSTGRES_USER" \
    -p "$POSTGRES_PORT" \
    -h "$POSTGRES_HOST" \
    "$@"
}

function psql_timescale() {
  if command -v pgcli &>/dev/null; then
    command="pgcli"
  else
    command="psql"
  fi
  port=$TIMESCALE_PORT_INTERNAL
  if [ "$TIMESCALE_HOST" = "localhost" ]; then
    port=$TIMESCALE_PORT
  fi
  PGPASSWORD="$TIMESCALE_PASSWORD" log_command $command \
    -U "$TIMESCALE_USER" \
    -p "$port" \
    -h "$TIMESCALE_HOST"
}

function migrate_umami() {
  echo "migrating umami"
  psql "$POSTGRES_URL" <services/umami/setup.sql
}

function migrate_timescale() {
  echo "Migrating timescale $TIMESCALE_PORT_INTERNAL"
  pushd "$PROJECT_ROOT/services/timescale"
  npm install &>/dev/null || true
  TIMESCALE_PORT_INTERNAL=$TIMESCALE_PORT_INTERNAL node ./scripts/migrate.js
  popd
}

function hasura_admin() {
  hasura_cmd console
}

# helper to run hasura commands
function hasura_cmd() {
  pushd services/hasura
  hasura --skip-update-check "$@" --endpoint "$HASURA_ENDPOINT" --admin-secret "$HASURA_GRAPHQL_ADMIN_SECRET"
  popd
}

function hasura_install_cli() {
  if ! [ -x "$(command -v hasura)" ]; then
    curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | VERSION=v2.1.0-beta.1 bash
  else
    HAS_UP_TO_DATE_HASURA_VERSION=$(hasura --skip-update-check version | grep 2.1.0 | wc -l)
    if [ "$HAS_UP_TO_DATE_HASURA_VERSION" == 0 ]; then
      curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | VERSION=v2.1.0-beta.1 bash
    fi
  fi
}

function migrate_hasura() {
  echo "migrating hasura"
  hasura_install_cli
  hasura version
  if [ "$HAS_UP_TO_DATE_HASURA_VERSION" == 0 ]; then
    echo "do we need to do anything to update to v2?"
  fi
  echo "hasura migrate $HASURA_ENDPOINT / $POSTGRES_DB"
  pushd "$PROJECT_ROOT/services/hasura"
  hasura --skip-update-check migrate apply --endpoint "$HASURA_ENDPOINT" --admin-secret "$HASURA_GRAPHQL_ADMIN_SECRET"
  echo "hasura metadata"
  hasura --skip-update-check metadata apply --endpoint "$HASURA_ENDPOINT" --admin-secret "$HASURA_GRAPHQL_ADMIN_SECRET"
  popd
  echo "hasura init functions"
  pushd "$PROJECT_ROOT/services/hasura"
  cat functions/*.sql |
    PGPASSWORD=$POSTGRES_PASSWORD psql \
      -p "$POSTGRES_PORT" \
      -h "$POSTGRES_HOST" \
      -U "${POSTGRES_USER:-postgres}" \
      -d "${POSTGRES_DB:-dish}" \
      --single-transaction
  echo "hasura migrate status"
  hasura --skip-update-check migrate status --endpoint "$HASURA_ENDPOINT" --admin-secret "$HASURA_GRAPHQL_ADMIN_SECRET"
  popd
}

function dump_scrape_data_to_s3() {
  _run_on_cluster postgres:12-alpine && return 0
  set -e
  copy_out="copy (select
      created_at,
      source,
      id_from_source,
      restaurant_id,
      location,
      data
      from scrape
    )
    to stdout with csv"
  echo "Dumping scrape table to S3..."
  PGPASSWORD="$POSTGRES_PASSWORD" psql \
    -h "$POSTGRES_HOST" \
    -U postgres \
    -d "${POSTGRES_DB:-dish}" \
    -c "$copy_out" |
    s3 put - "$DISH_BACKUP_BUCKET/scrape.csv"
  echo "...scrape table dumped tpo S3."
}

function main_db_command() {
  if [ "$POSTGRES_URL" = "" ]; then
    echo "no url given"
  fi
  echo "$1" | psql "$POSTGRES_URL" -P pager=off -P format=unaligned
}

function timescale_db_command() {
  if [ "$TIMESCALE_URL" = "" ]; then
    echo "no url given"
  fi
  echo "$1" | psql "$TIMESCALE_URL" -P pager=off -P format=unaligned
}

function scrape_json_query() {
  query="$1"
  timescale_db_command "select jsonb_agg(t) from ($query) t" | grep '\[{'
}

function main_json_query() {
  query="$1"
  main_db_command "select jsonb_agg(t) from ($query) t" | grep '\[{'
}

function hasura_clean_event_logs() {
  main_db_command '
    DELETE FROM hdb_catalog.event_invocation_logs;
    DELETE FROM hdb_catalog.event_log
      WHERE delivered = true OR error = true;
  '
}

function scrapes_update_distinct_sources() {
  timescale_command '
    INSERT INTO distinct_sources(
      scrape_id, source, id_from_source
    ) SELECT DISTINCT ON (
      source, id_from_source
    ) id, source, id_from_source
    FROM scrape
  '
}

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
    -h "$POSTGRES_HOST"
  PGPASSWORD="$POSTGRES_PASSWORD" log_command psql -d "$POSTGRES_DB" -U "$POSTGRES_USER" -p "$POSTGRES_PORT" -h "$POSTGRES_HOST"
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
  (cd services/hasura && hasura console --endpoint "http://localhost:$HASURA_PORT" --admin-secret=$HASURA_GRAPHQL_ADMIN_SECRET)
}

function migrate_hasura() {
  echo "migrating hasura"
  if ! [ -x "$(command -v hasura)" ]; then
    curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | VERSION=v1.3.3 bash
  fi
  hasura version
  echo "migrating db $POSTGRES_DB"
  pushd "$PROJECT_ROOT/services/hasura"
  echo "hasura migrate $HASURA_ENDPOINT"
  hasura --skip-update-check \
    migrate apply \
    --endpoint "$HASURA_ENDPOINT" \
    --admin-secret "$HASURA_GRAPHQL_ADMIN_SECRET"
  echo "hasura metadata"
  hasura --skip-update-check \
    metadata apply \
    --endpoint "$HASURA_ENDPOINT" \
    --admin-secret "$HASURA_GRAPHQL_ADMIN_SECRET"
  popd
  echo "init functions"
  pushd "$PROJECT_ROOT/services/hasura"
  cat functions/*.sql |
    PGPASSWORD=$POSTGRES_PASSWORD psql \
      -p "$POSTGRES_PORT" \
      -h "$POSTGRES_HOST" \
      -U "${POSTGRES_USER:-postgres}" \
      -d "${POSTGRES_DB:-dish}" \
      --single-transaction
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

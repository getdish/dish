#!/bin/bash

PROJECT_ROOT=$(git rev-parse --show-toplevel)
PROXY_PID=

pushd $PROJECT_ROOT
export all_env="$(bin/yaml_to_env.sh)"
eval "$all_env"
popd

function _kill_port_forwarder {
  echo "Killing \`kubectl proxy-forward ...\`"
  kill $PROXY_PID
}

function _ephemeral_pod() {
  random=$(cat /dev/urandom | tr -dc 'a-z' | fold -w 4 | head -n 1)
  name="ephemeral-pod-$random"
  image=$1
  cmd="$2"
  kubectl run -it $name \
    --image=$image \
    --restart=Never \
    -- sh -c "$cmd"
  kubectl delete pod $name
}

function _get_function_body() {
  echo $(declare -f $1 | sed '1,3d;$d')
}

function _build_script() {
  script=$(echo "$all_env" | sed 's/.*/export &/')
  for f in $(declare -F | cut -d ' ' -f3); do
    script+=$(echo -e "\nfunction $(declare -f $f)")
  done
  echo -e "$script\n"
}

function _run_on_cluster() {
  caller=$(echo "${FUNCNAME[1]}")
  function_body=$(_get_function_body $caller)
  script="$(_build_script)\n$function_body"
  code="echo -e ${script@Q} > /tmp/run.sh && source /tmp/run.sh $ORIGINAL_ARGS"
  _ephemeral_pod $1 "$code"
  exit $?
}

function _setup_s3() {
  apk add --no-cache -X http://dl-cdn.alpinelinux.org/alpine/edge/testing \
    s3cmd
}

function worker() {
  kubectl exec -it \
    $(kubectl get pods | grep worker | grep Running | awk '{print $1}') \
    -c worker \
    -- bash -c "$1"
}

function worker_cli() {
  worker "bash"
}

# Note that crawlers are also run on cron schedules. So this is just for
# manual runs.
function start_crawler() {
  worker "node /app/services/crawlers/_/$1/all.js"
}

function start_all_crawlers() {
  start_crawler "doordash"
  #start_crawler "google"
  start_crawler "grubhub"
  start_crawler "infatuated"
  start_crawler "michelin"
  start_crawler "tripadvisor"
  start_crawler "ubereats"
  start_crawler "yelp"
}

function db_migrate() {
  pushd $PROJECT_ROOT/services/hasura
  hasura --skip-update-check \
    migrate apply \
    --endpoint https://hasura.dishapp.com \
    --admin-secret $TF_VAR_HASURA_GRAPHQL_ADMIN_SECRET
  hasura --skip-update-check \
    metadata apply \
    --endpoint https://hasura.dishapp.com \
    --admin-secret $TF_VAR_HASURA_GRAPHQL_ADMIN_SECRET
  popd
}

function timescale_pg_password() {
  echo $(
    kubectl get secret \
      --namespace timescale \
      timescale-credentials \
      -o jsonpath="{.data.PATRONI_SUPERUSER_PASSWORD}" \
      | base64 --decode
  )
}

function copy_scrape_data_to_timescale() {
  _run_on_cluster postgres:12-alpine
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
  copy_in="copy scrape (
      time,
      source,
      id_from_source,
      restaurant_id,
      location,
      data
    ) from stdin csv"
  echo "Migrating scrape table..."
  PGPASSWORD=$TF_VAR_POSTGRES_PASSWORD psql \
    -h $TF_VAR_POSTGRES_HOST \
    -U postgres \
    -d dish \
    -c "$copy_out" \
  | \
  PGPASSWORD=$TF_VAR_TIMESCALE_SU_PASS psql \
    --set=sslmode=require \
    -h $TF_VAR_TIMESCALE_HOST \
    -U postgres \
    -d scrape_data \
    -c "$copy_in"
  echo "...scrape table migrated."
}

function dump_scrape_data_to_s3() {
  _run_on_cluster postgres:12-alpine
  set -e
  _setup_s3
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
  PGPASSWORD=$TF_VAR_POSTGRES_PASSWORD psql \
    -h $TF_VAR_POSTGRES_HOST \
    -U postgres \
    -d dish \
    -c "$copy_out" \
  | s3 put - $DISH_BACKUP_BUCKET/scrape.csv
  echo "...scrape table dumped tpo S3."
}

function redis_flush_all() {
  kubectl exec -it \
    redis-master-0 -n redis -c redis \
    -- bash -c 'redis-cli -c "FLUSHALL"'
}

function local_node_with_prod_env() {
  export LOG_TIMINGS=1
  export USE_PG_SSL=true
  export RUN_WITHOUT_WORKER=true
  export PGPORT=15432
  export PGPASSWORD=$TF_VAR_POSTGRES_PASSWORD
  export TIMESCALE_PORT=15433
  export TIMESCALE_PASSWORD=$TF_VAR_TIMESCALE_SU_PASS
  export HASURA_ENDPOINT=https://hasura.dishapp.com
  export HASURA_SECRET="$HASURA_GRAPHQL_ADMIN_SECRET"
  node $1
}

function remove_evicted_pods() {
  namespace=${1:-default}
  kubectl get pods -n $namespace \
    | grep Evicted | awk '{print $1}' \
    | xargs kubectl delete pod -n $namespace
}

function s3() {
  s3cmd \
    --host sfo2.digitaloceanspaces.com \
    --host-bucket '%(bucket).sfo2.digitaloceanspaces.com' \
    --access_key $TF_VAR_DO_SPACES_ID \
    --secret_key $TF_VAR_DO_SPACES_SECRET \
    --human-readable-sizes \
    "$@"
}

function list_backups() {
  s3 ls $DISH_BACKUP_BUCKET
}

function backup_main_db() {
  _run_on_cluster postgres:12-alpine
  set -e
  _setup_s3
  DUMP_FILE_NAME="dish-db-backup-`date +%Y-%m-%d-%H-%M`.dump"
  PGPASSWORD=$TF_VAR_POSTGRES_PASSWORD pg_dump \
    -U postgres \
    -h $TF_VAR_POSTGRES_HOST \
    -p 5432 \
    -d dish \
    -C -w --format=c | \
    s3 put - s3://dish-backups/$DUMP_FILE_NAME
  echo 'Successfully backed up main database'
}

function backup_scrape_db() {
  _run_on_cluster postgres:12-alpine
  set -e
  _setup_s3
  DUMP_FILE_NAME="dish-scrape-backup-`date +%Y-%m-%d-%H-%M`.dump"
  PGPASSWORD=$TF_VAR_TIMESCALE_SU_PASS pg_dump \
    -U postgres \
    -h $TF_VAR_TIMESCALE_HOST \
    -p 5432 \
    -d dish \
    -C -w --format=c | \
    s3 put - s3://dish-backups/$DUMP_FILE_NAME
  echo 'Successfully backed up scrape database'
}

get_all_backups() {
  s3 ls $DISH_BACKUP_BUCKET
}

get_latest_main_backup() {
  echo $(
    s3 ls $DISH_BACKUP_BUCKET | grep 'dish-db' | tail -1 | awk '{ print $4 }'
  )
}

get_latest_scrape_backup() {
  echo $(
    s3 ls $DISH_BACKUP_BUCKET \
      | tail -1 \
      | awk '{ print $4 }' \
      | grep "dish-db-backup"
    )
}

function _restore_main_backup() {
  backup=$1
  echo "Restoring $backup ..."
  s3 get $backup backup.dump
  cat backup.dump | PGPASSWORD=$TF_VAR_POSTGRES_PASSWORD pg_restore \
    -h $TF_VAR_POSTGRES_HOST \
    -U postgres \
    -d dish
}

function __restore_latest_main_backup() {
  _run_on_cluster postgres:12-alpine
  set -e
  _setup_s3
  echo $(s3 ls $DISH_BACKUP_BUCKET | tail -1 | awk '{ print $4 }')
  _restore_main_backup "$(get_latest_main_backup)"
}

function restore_main_backup() {
  _run_on_cluster postgres:12-alpine
  set -e
  _setup_s3
  _restore_main_backup "$1"
}

function restore_latest_main_backup() {
  __restore_latest_main_backup
  db_migrate
}

function restore_latest_scrape_backup() {
  _run_on_cluster postgres:12-alpine
  set -e
  _setup_s3
  latest_backup=$(get_latest_scrape_backup)
  s3 get \$latest_backup backup.dump
  echo "Restoring \$latest_backup ..."
  cat backup.dump | PGPASSWORD=$TF_VAR_POSTGRES_PASSWORD pg_restore \
    -h $TF_VAR_TIMESCALE_HOST \
    -U postgres \
    -d dish
}

function delete_unattached_volumes() {
  unattached_volumes="$(\
    doctl compute volume list \
      --format ID,DropletIDs \
      | rg -v '\[' \
      | tr -s ' ' \
      | cut -d ' ' -f 1 \
      | tail -n +2 \
  )"
  echo "$unattached_volumes" | while read volume_id ; do
    echo "Deleting $volume_id"
    doctl compute volume delete --force $volume_id
  done
}

function timescale_console() {
  PORT=15433
  echo "Waiting for connection to timescale..."
  kubectl port-forward pod/timescale-timescaledb-0 $PORT:5432 -n timescale &
  PROXY_PID=$!
  trap _kill_port_forwarder EXIT
  while ! netstat -tna | grep 'LISTEN\>' | grep -q ":$PORT\>"; do
    sleep 0.1
  done
  echo "...connected to timescale."
  PGPASSWORD=$TF_VAR_TIMESCALE_SU_PASS pgcli \
    -p $PORT \
    -h localhost \
    -U postgres \
    -d scrape_data
}

function postgres_console() {
  PORT=15432
  echo "Waiting for connection to Postgres..."
  kubectl port-forward svc/postgres-ha-postgresql-ha-pgpool $PORT:5432 -n postgres-ha &
  PROXY_PID=$!
  trap _kill_port_forwarder EXIT
  while ! netstat -tna | grep 'LISTEN\>' | grep -q ":$PORT\>"; do
    sleep 0.1
  done
  echo "...connected to Postgres."
  PGPASSWORD=$TF_VAR_POSTGRES_PASSWORD pgcli \
    -p $PORT \
    -h localhost \
    -U postgres \
    -d dish
}

function_to_run=$1
shift
ORIGINAL_ARGS="$@"
$function_to_run "$@"

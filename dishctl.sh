#!/bin/bash

PG_PROXY_PID=
TS_PROXY_PID=
REDIS_PROXY_PID=

if command -v git &> /dev/null; then
  PROJECT_ROOT=$(git rev-parse --show-toplevel)
  pushd $PROJECT_ROOT
    if [ -f "env.enc.production.yaml" ]; then
      export all_env="$(bin/yaml_to_env.sh)"
      eval "$all_env"
    else
      echo "Not loading ENV from env.enc.production.yaml as it doesn't exist"
    fi
  popd
else
  echo "Not loading ENV from env.enc.production.yaml as there's no \`git\` command"
  export all_env="$(env)"
fi


function generate_random_port() {
  echo "2$((1000 + RANDOM % 8999))"
}
REDIS_PROXY_PORT=$(generate_random_port)

function _kill_port_forwarder {
  echo "Killing script pids for \`kubectl proxy-forward ...\`"
  [ ! -z "$PG_PROXY_PID" ] && kill $PG_PROXY_PID
  [ ! -z "$TS_PROXY_PID" ] && kill $TS_PROXY_PID
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
}

function _setup_s3() {
  apk add --no-cache -X http://dl-cdn.alpinelinux.org/alpine/edge/testing \
    s3cmd
}

function worker() {
  kubectl exec -it \
    $(kubectl get pods \
      | grep -v worker-ui \
      | grep worker \
      | grep Running \
      | awk '{print $1}') \
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

function start_crawler_for_city() {
  worker "CITY='$2' node /app/services/crawlers/_/$1/all.js"
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

function timescale_migrate() {
  _TIMESCALE_PORT=$(generate_random_port)
  timescale_proxy $_TIMESCALE_PORT
  pushd $PROJECT_ROOT/services/timescaledb
  PG_PORT=$_TIMESCALE_PORT \
  PG_PASS=$TF_VAR_TIMESCALE_SU_PASS \
  DISH_ENV=production \
    ./migrate.sh
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
  _run_on_cluster postgres:12-alpine && return 0
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

function redis_command() {
  kubectl exec \
    redis-master-0 -n redis -c redis \
    -- bash -c "echo ${1@Q} | redis-cli"
}

function redis_console() {
  kubectl exec -it \
    redis-master-0 -n redis -c redis \
    -- bash -c "redis-cli"
}

function redis_flush_all() {
  redis_command 'FLUSHALL'
}

function bull_delete_queue() {
  queue=$1
  redis_command "EVAL \"\
    local keys = redis.call('keys', ARGV[1]) \
    for i=1,#keys,5000 do \
      redis.call('del', unpack(keys, i, math.min(i+4999, #keys))) \
    end \
    return keys \
  \" 0 bull:$queue*"
}

function local_node_with_prod_env() {
  _TIMESCALE_PORT=$(generate_random_port)
  _PG_PORT=$(generate_random_port)
  postgres_proxy $_PG_PORT
  timescale_proxy $_TIMESCALE_PORT
  export DISH_DEBUG=1
  export USE_PG_SSL=true
  export RUN_WITHOUT_WORKER=true
  export PGPORT=$_PG_PORT
  export PGPASSWORD=$TF_VAR_POSTGRES_PASSWORD
  export TIMESCALE_PORT=$_TIMESCALE_PORT
  export TIMESCALE_PASSWORD=$TF_VAR_TIMESCALE_SU_PASS
  export HASURA_ENDPOINT=https://hasura.dishapp.com
  export HASURA_SECRET="$TF_VAR_HASURA_GRAPHQL_ADMIN_SECRET"
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
  s3 ls $DISH_BACKUP_BUCKET | sort -k1,2
}

function backup_main_db() {
  _run_on_cluster postgres:12-alpine && return 0
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
  _run_on_cluster postgres:12-alpine && return 0
  set -e
  _setup_s3
  DUMP_FILE_NAME="dish-scrape-backup-`date +%Y-%m-%d-%H-%M`.dump"
  PGPASSWORD=$TF_VAR_TIMESCALE_SU_PASS pg_dump \
    -U postgres \
    -h $TF_VAR_TIMESCALE_HOST \
    -p 5432 \
    -d scrape_data \
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
      | grep "dish-scrape-backup"
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
  _run_on_cluster postgres:12-alpine && return 0
  set -e
  _setup_s3
  echo $(s3 ls $DISH_BACKUP_BUCKET | tail -1 | awk '{ print $4 }')
  _restore_main_backup "$(get_latest_main_backup)"
}

function restore_main_backup() {
  _run_on_cluster postgres:12-alpine && return 0
  set -e
  _setup_s3
  _restore_main_backup "$1"
}

function restore_latest_main_backup() {
  __restore_latest_main_backup
  db_migrate
}

function restore_latest_scrape_backup() {
  _run_on_cluster postgres:12-alpine && return 0
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

function timescale_proxy() {
  random_port="$(generate_random_port)"
  PORT=${1:-$random_port}
  echo "Waiting for connection to timescale..."
  kubectl port-forward pod/timescale-timescaledb-0 $PORT:5432 -n timescale &
  TS_PROXY_PID=$!
  trap _kill_port_forwarder EXIT
  while ! netstat -tna | grep 'LISTEN\>' | grep -q ":$PORT\>"; do
    sleep 0.1
  done
  echo "...connected to timescale."
}

function timescale_console() {
  PORT=$(generate_random_port)
  timescale_proxy $PORT
  PGPASSWORD=$TF_VAR_TIMESCALE_SU_PASS pgcli \
    -p $PORT \
    -h localhost \
    -U postgres \
    -d scrape_data
}

function postgres_proxy() {
  random_port="$(generate_random_port)"
  PORT=${1:-$random_port}
  echo "Waiting for connection to Postgres..."
  kubectl port-forward svc/postgres-ha-postgresql-ha-pgpool $PORT:5432 -n postgres-ha &
  PG_PROXY_PID=$!
  trap _kill_port_forwarder EXIT
  while ! netstat -tna | grep 'LISTEN\>' | grep -q ":$PORT\>"; do
    sleep 0.1
  done
  echo "...connected to Postgres."
}

function postgres_console() {
  PORT=$(generate_random_port)
  postgres_proxy $PORT
  PGPASSWORD=$TF_VAR_POSTGRES_PASSWORD pgcli \
    --auto-vertical-output \
    -p $PORT \
    -h localhost \
    -U postgres \
    -d dish
}

function main_db_command() {
  PORT=$(generate_random_port)
  postgres_proxy $PORT
  echo "$1" | PGPASSWORD=$TF_VAR_POSTGRES_PASSWORD psql \
    -p $PORT \
    -h localhost \
    -U postgres \
    -d dish
}

function timescale_command() {
  PORT=$(generate_random_port)
  timescale_proxy $PORT
  echo "$1" | PGPASSWORD=$TF_VAR_TIMESCALE_SU_PASS psql \
    -p $PORT \
    -h localhost \
    -U postgres \
    -d scrape_data
}

function redis_proxy() {
  echo "Waiting for connection to redis..."
  kubectl port-forward svc/redis-master $REDIS_PROXY_PORT:6379 -n redis &
  REDIS_PROXY_PID=$!
  trap _kill_port_forwarder EXIT
  while ! netstat -tna | grep 'LISTEN\>' | grep -q ":$REDIS_PROXY_PORT\>"; do
    sleep 0.1
  done
  echo "...connected to redis."
}

function logs() {
  namespace=${2:-default}
  kubectl -n $namespace \
    logs -f \
    --selector="app=$2" \
    --max-log-requests=10
}

function run_local_search_endpoint() {
  PROXY_PORT=$(generate_random_port)
  postgres_proxy $PROXY_PORT
  export PORT=10001
  export POSTGRES_PASSWORD=$TF_VAR_POSTGRES_PASSWORD
  export PGPORT=$PROXY_PORT
  pushd $PROJECT_ROOT/services/search
  go generate
  go run ./main.go ./embedded.go
  popd
}

function bull_console() {
  redis_proxy
  $PROJECT_ROOT/services/crawlers/node_modules/.bin/bull-repl \
    "connect \
      --host localhost \
      --port $REDIS_PROXY_PORT \
      $1"
}

function gorse_status() {
  _run_on_cluster alpine && return 0
  apk add --no-cache curl
  curl http://gorse:9000/status
}

function install_doctl() {
  DOCTL_VERSION='1.42.0'
  DOCTL_BINARY=https://github.com/digitalocean/doctl/releases/download/v$DOCTL_VERSION/doctl-$DOCTL_VERSION-linux-amd64.tar.gz
  DOCTL_PATH=$HOME/bin/
  echo "Installing \`doctl\` binary v$DOCTL_VERSION..."
  curl -sL $DOCTL_BINARY | tar -xzv -C $DOCTL_PATH
  doctl version
}

function init_doctl() {
  doctl auth init -t $TF_VAR_DO_DISH_KEY
  doctl kubernetes cluster kubeconfig save $TF_VAR_CURRENT_DISH_CLUSTER
}

function install_kubectl() {
  VERSION=1.18.0
  BINARY=https://storage.googleapis.com/kubernetes-release/release/v$VERSION/bin/linux/amd64/kubectl
  INSTALL_PATH=$HOME/bin
  echo "Installing \`kubectl\` binary v$VERSION..."
  curl -sL -o $INSTALL_PATH/kubectl $BINARY
  chmod a+x $INSTALL_PATH/kubectl
}

function ping_home_page() {
  curl 'https://search.dishapp.com/top_cuisines?lon=-122.421351&lat=37.759251&distance=0.16'
}

function hasura_clean_event_logs() {
  main_db_command '
    DELETE FROM hdb_catalog.event_invocation_logs;
    DELETE FROM hdb_catalog.event_log
      WHERE delivered = true OR error = true;
  '
}

function postgres_replica_ssh() {
  number=${1:-0}
  kubectl ssh \
    -n postgres-ha \
    -c postgresql \
    -u root \
    postgres-ha-postgresql-ha-postgresql-$number \
    -- bash
}

function pgpool_status() {
  sql='SHOW pool_processes'
  command="PGPASSWORD=$TF_VAR_POSTGRES_PASSWORD psql \
    -U postgres \
    -h localhost \
    -c '$sql'"
  pods=$(kubectl get pods -n postgres-ha \
    | grep ha-pgpool \
    | cut -d ' ' -f 1 \
    | tail -n +1)
  echo "$pods" | while read pod; do
    result=$(kubectl \
      exec \
      -n postgres-ha \
      $pod -- \
      bash -c "$command")
    total=$(echo -e "$result" | wc -l)
    used=$(echo -e "$result" | grep 'dish' | wc -l)
    echo "$pod: $used/$(expr $total - 3)"
  done
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

function crawler_mem_usage() {
  ps -eo size,pid,usconcer,command --sort -size \
    | awk '{ hr=$1/1024 ; printf("%13.2f Mb ",hr) } { for ( x=4 ; x<=NF ; x++ ) { printf("%s ",$x) } print "" }' \
    | cut -d "" -f2 \
    | cut -d "-" -f1 \
    | grep sandbox
}

function self_crawl_by_query() {
  [ -z "$1" ] && exit 1
  query="SELECT id FROM restaurant $1"
  echo "Running self crawler with SQL: $query"
  worker "
    QUERY=\"$query\" \
      node /app/services/crawlers/_/self/sandbox.js
  "
}

function_to_run=$1
shift
ORIGINAL_ARGS="$@"
$function_to_run "$@"

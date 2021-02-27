#!/bin/bash
set -e
set -o pipefail

 #Does this put our `set -e` into all the functions?
export SHELLOPTS

PG_PROXY_PID=
TS_PROXY_PID=
REDIS_PROXY_PID=
GCLOUD_PROJECT="dish-258800"
DISH_REGISTRY="gcr.io/$GCLOUD_PROJECT"
PATH=$PATH:~/bin/google-cloud-sdk/bin

function generate_random_port() {
  echo "2$((1000 + RANDOM % 8999))"
}
REDIS_PROXY_PORT=$(generate_random_port)

function _kill_port_forwarder {
  echo "Killing script pids for \`kubectl proxy-forward ...\`"
  ([ ! -z "$PG_PROXY_PID" ] && kill $PG_PROXY_PID) || true
  ([ ! -z "$TS_PROXY_PID" ] && kill $TS_PROXY_PID) || true
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

function patch_service_account() {
  kubectl patch serviceaccount default \
    -p '{"imagePullSecrets": [{"name": "docker-config-json"}]}'
}

function _get_function_body() {
  echo $(declare -f $1 | sed '1,3d;$d')
}

function _build_script() {
  script=$(echo "$all_env" | sed 's/.*/export &/')
  for f in $(declare -F | cut -d ' ' -f3); do
    if [[ "$f" == "_buildkit_build" ]]; then
      continue
    fi
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
  apk add --no-cache -X http://dl-cdn.alpinelinux.org/alpine/edge/testing s3cmd
}

function send_slack_monitoring_message() {
  message=$1
  curl -X POST $SLACK_MONITORING_HOOK \
    -H 'Content-type: application/json' \
    --data @- <<EOF
    {
      "text": "$message",
    }
EOF
}

function _worker_k8s() {
  kubectl exec -it \
    $(kubectl get pods \
      | grep -v worker-ui \
      | grep worker \
      | grep Running \
      | awk '{print $1}') \
    -c worker \
    -- bash -c "$1"
}

function _worker_staging() {
  worker_env="REDIS_HOST=redis PGHOST=postgres TIMESCALE_HOST=timescaledb"
  docker_run_base "bash -c \"$worker_env $1\""
}

function worker() {
  if grep -q "dish-do" "/etc/hostname"; then
    _worker_staging "$1"
  else
    _worker_staging "$1"
    #_worker_k8s "$1"
  fi
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

function start_all_crawlers_for_city() {
  start_crawler_for_city "doordash" "$1"
  start_crawler_for_city "google" "$1"
  start_crawler_for_city "grubhub" "$1"
  start_crawler_for_city "infatuated" "$1"
  start_crawler_for_city "tripadvisor" "$1"
  start_crawler_for_city "yelp" "$1"
  start_crawler_for_city "ubereats" "$1"
}

function start_all_crawlers() {
  start_crawler "doordash"
  start_crawler "google"
  start_crawler "grubhub"
  start_crawler "infatuated"
  start_crawler "tripadvisor"
  start_crawler "yelp"
  start_crawler "ubereats"
}

function all_crawlers_for_cities() {
  #start_all_crawlers_for_city 'San Francisco, CA'
  #start_all_crawlers_for_city 'Los Angeles, CA'
  #start_all_crawlers_for_city 'San Jose, CA'
  start_all_crawlers_for_city 'Redwood City, CA'
  start_all_crawlers_for_city 'Fremont, CA'
  start_all_crawlers_for_city 'San Rafael, CA'
  #start_all_crawlers_for_city 'Chicago, Illinois'
  #start_all_crawlers_for_city 'Tuscon, Arizona'
  #start_all_crawlers_for_city 'Istanbul, Turkey'
}

function _db_migrate() {
  hasura_endpoint=$1
  admin_secret=$2
  postgres_password=$3
  postgres_port=$4
  init=$5
  pushd $PROJECT_ROOT/services/hasura
  if [[ "$init" != "init" ]]; then
    cat functions/*.sql | \
      PGPASSWORD=$postgres_password psql \
      -p $postgres_port \
      -h localhost \
      -U postgres \
      -d dish \
      --single-transaction
  fi
  hasura --skip-update-check \
    migrate apply \
    --endpoint $hasura_endpoint \
    --admin-secret $admin_secret
  hasura --skip-update-check \
    metadata apply \
    --endpoint $hasura_endpoint \
    --admin-secret $admin_secret
  cat functions/*.sql | \
    PGPASSWORD=$postgres_password psql \
    -p $postgres_port \
    -h localhost \
    -U postgres \
    -d dish \
    --single-transaction
  popd
}

function db_migrate() {
  _PG_PORT=$(generate_random_port)
  postgres_proxy $_PG_PORT
  pushd $PROJECT_ROOT/services/hasura
  _db_migrate \
    https://hasura.dishapp.com \
    "$TF_VAR_HASURA_GRAPHQL_ADMIN_SECRET" \
    "$TF_VAR_POSTGRES_PASSWORD" \
    "$_PG_PORT"
  popd
}

function db_migrate_local() {
  if [[ $USE_PROD_HASURA_PASSWORD == "true" ]]; then
    HASURA_ADMIN_SECRET="$TF_VAR_HASURA_GRAPHQL_ADMIN_SECRET"
  fi
  echo "admin secret is $HASURA_ADMIN_SECRET"
  _db_migrate \
    http://localhost:8080 \
    "${HASURA_ADMIN_SECRET:-password}" \
    postgres \
    5432 \
    "$1"
}

function db_clear_local() {
  rm -rf ~/.dish/postgres
  mkdir ~/.dish/postgres
}

function timescale_migrate() {
  _TIMESCALE_PORT=$(generate_random_port)
  timescale_proxy $_TIMESCALE_PORT
  pushd $PROJECT_ROOT/services/timescaledb
  PG_PORT=$_TIMESCALE_PORT \
  PG_PASS=$TF_VAR_TIMESCALE_SU_PASS \
  DISH_ENV=production ./migrate.sh
  popd
}

function timescale_migrate_local() {
  pushd $PROJECT_ROOT/services/timescaledb
  DISH_ENV=not-production ./migrate.sh
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

function psql_s3_for_big_data() {
  _run_on_cluster postgres:12-alpine && return 0
  _setup_s3
  sh
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
  export RUN_WITHOUT_WORKER=${RUN_WITHOUT_WORKER:-true}
  export PGPORT=$_PG_PORT
  export PGPASSWORD=$TF_VAR_POSTGRES_PASSWORD
  export TIMESCALE_PORT=$_TIMESCALE_PORT
  export TIMESCALE_PASSWORD=$TF_VAR_TIMESCALE_SU_PASS
  export HASURA_ENDPOINT=https://hasura.dishapp.com
  export HASURA_SECRET="$TF_VAR_HASURA_GRAPHQL_ADMIN_SECRET"
  if [[ $DISABLE_GC != "1" ]]; then
    export GC_FLAG="--expose-gc"
  fi
  node \
    --max-old-space-size=4096 \
    $GC_FLAG \
    $1
}

function staging_ports_tunnel() {
  ssh \
    -L 15432:localhost:5432 \
    -L 15433:localhost:5433 \
    root@ssh.staging.dishapp.com
}

# NB this needs the function `staging_ports_tunnel` to have been run
function local_node_with_staging_env() {
  export DISH_DEBUG=1
  export RUN_WITHOUT_WORKER=${RUN_WITHOUT_WORKER:-true}
  export PGPORT=15432
  export PGPASSWORD=postgres
  export TIMESCALE_PORT=15433
  export TIMESCALE_PASSWORD=postgres
  export HASURA_ENDPOINT=https://hasura-staging.dishapp.com
  export HASURA_SECRET="$TF_VAR_HASURA_GRAPHQL_ADMIN_SECRET"
  node \
    --max-old-space-size=4096 \
    $1
}

function dish_app_generate_tags() {
  export HASURA_ENDPOINT=https://hasura-staging.dishapp.com
  export HASURA_SECRET="password"
  export IS_LIVE=1
  pushd $PROJECT_ROOT/dish-app
  ../node_modules/.bin/ts-node --transpile-only ./etc/generate_tags.ts
}

function remove_evicted_pods() {
  namespace=${1:-default}
  kubectl get pods -n $namespace \
    | grep Evicted \
    | awk '{print $1}' \
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

restore_latest_main_backup_to_local() {
  latest_backup=$(get_latest_main_backup)
  dump_file="/tmp/latest_dish_backup.dump"
  s3 get "$latest_backup" "$dump_file"
  PGPASSWORD=postgres pg_restore -h localhost -U postgres -p 5432 -d dish "$dump_file"
}

restore_latest_scrapes_backup_to_local() {
  latest_backup=$(get_latest_scrape_backup)
  dump_file="/tmp/latest_scrape_backup.dump"
  s3 get "$latest_backup" "$dump_file"
  PGPASSWORD=postgres pg_restore -h localhost -U postgres -p 5433 -d dish "$dump_file"
}

get_latest_scrape_backup() {
  echo $(
    s3 ls $DISH_BACKUP_BUCKET \
      | grep "dish-scrape-backup" \
      | tail -1 \
      | awk '{ print $4 }'
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
  while ! netstat -tna | grep 'LISTEN' | grep -q "$PORT"; do
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
  while ! netstat -tna | grep 'LISTEN' | grep -q "$PORT"; do
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
    -P pager=off \
    -P format=unaligned \
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
  while ! netstat -tna | grep 'LISTEN' | grep -q "$REDIS_PROXY_PORT"; do
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

function run_local_search_endpoint_staging() {
  export PORT=10001
  export POSTGRES_PASSWORD=postgres
  export PGPORT=15432
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

function install_gcloud_sdk() {
  # 297.0.1 is needed on Github Actions
  # see: https://github.com/google-github-actions/setup-gcloud/issues/128
  GCLOUD_VERSION="297.0.1"
  base=https://dl.google.com/dl/cloudsdk/channels/rapid/downloads
  archive=$base/google-cloud-sdk-$GCLOUD_VERSION-linux-x86_64.tar.gz
  install_path=$HOME/bin
  echo "Installing GCloud SDK v$GCLOUD_VERSION..."
  curl -sL "$archive" | tar xzf - -C /tmp
  cp -a /tmp/google-cloud-sdk $install_path
  gcloud_init
}

function gcloud_init() {
  # This service account needs the "Project Owner" role! Way too much power.
  # Follow this issue for any fixes: https://issuetracker.google.com/issues/134928412
  gcloud auth activate-service-account --key-file k8s/etc/dish-gcloud.enc.json
  gcloud config set core/project "$GCLOUD_PROJECT"
  gcloud config set builds/use_kaniko False
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
  worker "QUERY=${query@Q} node /app/services/crawlers/_/self/sandbox.js"
}

# Watch progress at https://worker-ui.k8s.dishapp.com/ui
function limited_self_crawl_by_sanfran_cuisine() {
  query="
    WHERE st_dwithin(
      location, st_makepoint(-122.42, 37.76), 0.2
    )
    AND (
      tag_names @> '\"mexican__taco\"'
      OR
      tag_names @> '\"vietnamese__pho\"'
    )
  "
  self_crawl_by_query "$query"
}

function update_node_taints_for() {
  type="$1"
  nodes="$(kubectl get nodes | grep dish-$type-pool | cut -d ' ' -f 1 | tr '\n' ' ')"
  kubectl taint --overwrite node $nodes dish-taint=$type-only:NoSchedule
}

function update_all_node_taints() {
  update_node_taints_for "db"
  update_node_taints_for "critical"
}

function list_node_taints() {
  kubectl get nodes \
    -o 'custom-columns=NAME:.metadata.name,TAINTS:.spec.taints' \
    --no-headers
}

# Many thanks to Stefan Farestam
# https://stackoverflow.com/a/21189044/575773
function parse_yaml {
   local prefix=$2
   local s='[[:space:]]*' w='[a-zA-Z0-9_]*' fs=$(echo @|tr @ '\034')
   sed -ne "s|^\($s\):|\1|" \
        -e "s|^\($s\)\($w\)$s:$s[\"']\(.*\)[\"']$s\$|\1$fs\2$fs\3|p" \
        -e "s|^\($s\)\($w\)$s:$s\(.*\)$s\$|\1$fs\2$fs\3|p"  $1 |
   awk -F$fs '{
      indent = length($1)/2;
      vname[indent] = $2;
      for (i in vname) {if (i > indent) {delete vname[i]}}
      if (length($3) > 0) {
         vn=""; for (i=0; i<indent; i++) {vn=(vn)(vname[i])("_")}
         printf("%s%s%s=\"%s\"\n", "'$prefix'",vn, $2, $3);
      }
   }'
}

function yaml_to_env() {
  parse_yaml $PROJECT_ROOT/env.enc.production.yaml | sed 's/\$/\\$/g' | xargs -0
}

function _gcloud_build_submit() {
  path="$1"
  image="$2"
  dish_base_version="$3"
  base_arg="'--build-arg', 'DISH_BASE_VERSION=$dish_base_version'"
  yaml="
steps:
- name: 'gcr.io/cloud-builders/docker'
  args: [
    'build',
    '-t', '$image',
    '--cache-from', '$image',
    '-f', '$path/Dockerfile',
    '.', $base_arg]
images: ['$image']
options:
  machineType: 'N1_HIGHCPU_8'
"
  config="$(mktemp)"
  echo "$yaml" > "$config"
  pushd $PROJECT_ROOT
  echo "submitting build for image $image"
  gcloud builds submit --timeout 1h --config "$config"
  popd
}

function _gcloud_build() {
  dockerfile_path=$2
  name=$3
  dish_base_version=${4:-$DOCKER_TAG_NAMESPACE}
  dish_docker_login
  echo "Building image: $name |$dish_base_version|$push|"
  _gcloud_build_submit "$dockerfile_path" "$name" "$dish_base_version"
  if [[ "$1" == "pull" ]]; then
    docker pull "$name"
  fi
}

function gcloud_build() {
  _gcloud_build push "$@"
}

function gcloud_build_output_local() {
  _gcloud_build pull "$@"
}

function build_dish_service() {
  path=$1
  name=$(echo $path | cut -d / -f 2)
  image=$DISH_REGISTRY/$name:$DOCKER_TAG_NAMESPACE
  gcloud_build_output_local $path $image
}

function _build_dish_service() {
  $PROJECT_ROOT/dishctl.sh build_dish_service "$@"
}
export -f _build_dish_service

function build_dish_base() {
  echo "Building base..."
  gcloud_build . $BASE_IMAGE
}

function build_all_dish_services() {
  echo "Building all Dish services..."
  build_dish_base
  echo "Pulling base..."
  docker pull $BASE_IMAGE
  echo "Building worker, dish-hooks, search, dish-app in parallel..."
  parallel -j 4 --tag --lb _build_dish_service ::: \
    'services/worker' \
    'services/dish-hooks' \
    'services/search' \
    'dish-app'
  echo "...all Dish services built."
  docker images
}

function docker_run_base() {
  command="docker-compose run --rm base $1"
  echo "Running: $command"
  eval $command
}

# Docker Compose doesn't pull images with a build key in their definition?
function docker_pull_images_that_compose_would_rather_build() {
  image="$DISH_REGISTRY/%:$DOCKER_TAG_NAMESPACE"
  parallel -j 4 --tag --lb -I% docker pull "$image" ::: \
    'worker' \
    'dish-hooks' \
    'search' \
    'dish-app'
}

function ci_prettier() {
  docker_run_base yarn prettier --check "**/*.{ts,tsx}"
}

function ci_rename_tagged_images_to_latest() {
  dish_docker_login
  for image in "${ALL_IMAGES[@]}"
  do
    current=$DISH_REGISTRY/$image:$DOCKER_TAG_NAMESPACE
    new=$DISH_REGISTRY/$image
    docker tag $current $new:latest
  done
  docker images
}

function ci_push_images_to() {
  tag=$1
  echo "Pushing new docker images to $tag registry..."
  dish_docker_login
  for image in "${ALL_IMAGES[@]}"
  do
    if [[ "$image" == "worker" ]]; then
      continue
    fi
    new=$DISH_REGISTRY/$image:$tag
    docker push $new
  done
}

function rollout_all_services() {
  kubectl rollout \
    restart deployment \
    $(kubectl get deployments | grep -v worker | tail -n +2 | cut -d ' ' -f 1)
}

# Usage dishctl.sh push_repo_image $repo $image_name
function push_repo_image() {
  repo=$1
  default_name=$(basename ${repo%.*})
  name=${2:-$default_name}
  image=$DISH_REGISTRY/$name
  tmp_dir=$(mktemp -d -t dish-XXXXXXXXXX)
  git clone --depth 1 $repo $tmp_dir
  echo "Building image: '$image'"
  buildkit_build $tmp_dir $image '' $tmp_dir
  rm -rf $tmp_dir
}

function push_auxillary_images() {
  push_repo_image 'git@github.com:getdish/image-quality-api.git' image-quality-server
  push_repo_image 'git@github.com:getdish/grafana-backup-tool.git' grafana-backup-tool
  push_repo_image 'git@github.com:getdish/imageproxy.git' imageproxy
  buildkit_build $PROJECT_ROOT/services/gorse $DISH_REGISTRY/gorse
  buildkit_build $PROJECT_ROOT/services/cron $DISH_REGISTRY/cron
}

function dish_docker_login() {
  yes | gcloud auth configure-docker gcr.io || true
}

function grafana_backup() {
  _run_on_cluster $DISH_REGISTRY/grafana-backup-tool && return 0
  set -e
  export GRAFANA_TOKEN="$GRAFANA_API_KEY"
  export GRAFANA_URL=https://grafana.k8s.dishapp.com
  grafana-backup save
  backup=$(ls _OUTPUT_/)
  destination=$DISH_BACKUP_BUCKET/grafan-backups
  s3 put _OUTPUT_/$backup $destination/$backup
  s3 ls $destination/ | sort -k1,2
}

function terraform_apply() {
  pushd $PROJECT_ROOT/k8s
  eval $(yaml_to_env) terraform apply
  popd
}

function scale_min() {
  kubectl scale --replicas=1 deployment worker
  kubectl scale --replicas=1 deployment bert
  kubectl scale --replicas=1 deployment image-quality-api
}

# This is just for quick deploys. Of course it skips our test suits in CI but if
# you need to get something deployed quickly then use at your own risk.
# Usage: ./dishctl.sh hot_deploy path/to/Dockerfile
# You need the `buildctl` binary installed
# Eg; `brew install buildkitd`
function hot_deploy() {
  service_path=$1
  service_name="${service_path##*/}"

  echo "Hot deploying $1 service..."

  echo "Building the base image first..."
  build_dish_base
  echo "Base image built."

  NAME=$DISH_REGISTRY/$service_name

  ./dishctl.sh buildkit_build $service_path $NAME

  kubectl rollout restart deployment/$service_name
}

function buildkit_build_local() {
  service_path=$1
  service_name="${service_path##*/}"
  echo "Building the base image first..."
  buildkit_build_output_local . $BASE_IMAGE
  echo "Base image built."
  NAME=$DISH_REGISTRY/$service_name
  echo "Building $NAME..."
  buildkit_build_output_local $service_path $NAME
  echo "$NAME built."
}

function volume_debugger() {
  pvc=$1
  command=$2
  namespace=${3:-default}
  name="volume-debugger"
  yaml="
    kind: Pod
    apiVersion: v1
    metadata:
      name: $name
    spec:
      volumes:
      - name: volume-to-debug
        persistentVolumeClaim:
          claimName: $pvc
      containers:
      - name: debugger
        image: busybox
        command: ['sleep', '3600']
        volumeMounts:
        - mountPath: '/data'
          name: volume-to-debug
  "
  echo "$yaml" | kubectl -n $namespace create -f -
  trap "kubectl -n $namespace delete pod $name --grace-period=0 --force" EXIT
  while [ "$(kubectl -n $namespace get pods | grep 'volume-debugger' | grep 'Running')" = "" ]; do
    sleep 1
    echo "Waiting for volume-debugger pod to start..."
  done
  kubectl -n $namespace exec -it volume-debugger -- sh -c "$command"
}

function redis_pvc_wipe() {
  file="/data/appendonly.aof"
  command="rm $file && ls -alh $file"
  volume_debugger 'redis-data-redis-master-0' "$command" 'redis'
  redis_flush_all
  kubectl rollout restart deployment/worker
}

function get_github_actions_runs() {
  curl -u "tombh:$GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/repos/getdish/dish/actions/runs
}

function get_sha_build_status() {
  current_sha=$(git rev-parse HEAD)
  response=$(get_github_actions_runs)
  statuses=$(
    echo $response | jq '.workflow_runs[] | .head_sha + " " + .conclusion'
  )
  current_commit_status=$(echo "$statuses" | grep $current_sha)
  if echo "$current_commit_status" | grep -q "success"; then
    echo "passed"
  else
    echo "failed"
  fi
}

function urlencode() {
  singles=${1//\'/\\\'}
  python -c "import sys, urllib.parse as ul; print(ul.quote('$singles'))"
}

function bert_sentiment() {
  text=$(urlencode "$1")
  url="https://bert.k8s.dishapp.com/?text=$text"
  curl "$url"
}

function docker_compose_up_for_devs() {
  extra=$1
  services=$(
    docker-compose config --services \
      | grep -E -v 'base|nginx|dish-app|image-quality|image-proxy|bert|worker' \
      | tr '\r\n' ' '
  )
  echo "Starting the following services: $services"
  export HASURA_GRAPHQL_ADMIN_SECRET=password
  if [ -z "$extra" ]; then
    docker-compose up $services
  else
    docker-compose up "$extra" $services
  fi
}

function docker_compose_up_for_tests() {
  extra=$1
  services=$(
    docker-compose config --services \
      | grep -E -v 'base|nginx|image-quality|image-proxy|bert|worker' \
      | tr '\r\n' ' '
  )
  echo "Starting the following services: $services"
  export HASURA_GRAPHQL_ADMIN_SECRET=password
  if [ -z "$extra" ]; then
    docker-compose up $services
  else
    docker-compose up "$extra" $services
  fi
}

function docker_compose_up_for_staging() {
  echo "Use 'docker-compose logs -f' to stream logs"
  command="$(echo $all_env | tr '\r\n' ' ') TF_VAR_HASURA_GRAPHQL_ADMIN_SECRET=password docker-compose up -d"
  eval $command
}

function staging_ssh() {
  ssh root@ssh.staging.dishapp.com \
    -t \
    -i $PROJECT_ROOT/k8s/etc/ssh/dish-staging.priv \
    'tmux attach'
}

function staging_restart() {
  ssh root@ssh.staging.dishapp.com \
    -t \
    -i $PROJECT_ROOT/k8s/etc/ssh/dish-staging.priv \
    'cd /app && docker-compose restart'
}

function sync_local_code_to_staging() {
  rsync -avP --filter=':- .gitignore' . root@ssh.staging.dishapp.com:/app
}

if command -v git &> /dev/null; then
  export PROJECT_ROOT=$(git rev-parse --show-toplevel)
  branch=$(git rev-parse --abbrev-ref HEAD)
  export DOCKER_TAG_NAMESPACE=${branch//\//-}
  export BASE_IMAGE=$DISH_REGISTRY/base:$DOCKER_TAG_NAMESPACE
  pushd $PROJECT_ROOT >/dev/null
    if [ -f "env.enc.production.yaml" ]; then
      export all_env="$(yaml_to_env)"
      eval "$all_env"
    else
      echo "Not loading ENV from env.enc.production.yaml as it doesn't exist"
    fi
  popd >/dev/null
else
  echo "Not loading ENV from env.enc.production.yaml as there's no \`git\` command"
  export all_env="$(env)"
fi

declare -a ALL_IMAGES=(
  "base"
  "dish-app"
  "worker"
  "dish-hooks"
  "search"
)

function_to_run=$1
shift
ORIGINAL_ARGS="$@"
$function_to_run "$@"

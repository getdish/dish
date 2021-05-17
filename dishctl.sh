#!/bin/bash
set -eo pipefail

 #Does this put our `set -e` into all the functions?
export SHELLOPTS

PG_PROXY_PID=
TS_PROXY_PID=

DISH_ENV="${DISH_ENV:-production}"
echo "running in env $DISH_ENV"
ENV_FILE=".env.$DISH_ENV"

function generate_random_port() {
  echo "2$((1000 + RANDOM % 8999))"
}

function log_command {
  echo "$" "$@"
  eval $(printf '%q ' "$@") < /dev/tty
}

function dish_registry_auth() {
  flyctl auth docker
}

function _kill_port_forwarder {
  echo "Killing script pids for \`kubectl proxy-forward ...\`"
  ([ ! -n "$PG_PROXY_PID" ] && kill $PG_PROXY_PID) || true
  ([ ! -n "$TS_PROXY_PID" ] && kill $TS_PROXY_PID) || true
}

function _setup_s3() {
  apk add --no-cache -X http://dl-cdn.alpinelinux.org/alpine/edge/testing s3cmd
}

function send_slack_monitoring_message() {
  message=$1
  curl -X POST "$SLACK_MONITORING_HOOK" \
    -H 'Content-type: application/json' \
    --silent \
    --output /dev/null \
    --show-error \
    --data @- <<EOF
    {
      "text": "$message",
    }
EOF
}

function reset_hosts() {
  egrep -v "internal" ~/.ssh/known_hosts > /tmp/known_hosts \
    && rm ~/.ssh/known_hosts \
    && mv /tmp/known_hosts ~/.ssh/known_hosts
}

function worker_ssh() {
  fly_tunnel
  log_command ssh -o StrictHostKeyChecking=no -l "root" "dish-worker.internal" -- "$@"
}

function worker_exec() {
  set -e
  worker_ssh "$@"
}

function stop_all_crawls() {
  curl -X 'POST' https://worker.dishapp.com/clear -H 'queues: all'
}

# comma separated
function stop_crawl() {
  curl -X 'POST' https://worker.dishapp.com/clear -H "queues: $@"
}

# Note that crawlers are also run on cron schedules.
# For cities list see: crawlers/src/utils "CITY_LIST"

# example: ./dishctl.sh start_crawler Yelp
function start_crawler() {
  worker_exec "node /app/services/crawlers/_/$1/all.js"
}

# example: ./dishctl.sh start_crawler_for_city yelp  Tucson, Arizona
function start_crawler_for_city() {
  worker_exec "node /app/services/crawlers/dist/$1/all.js --city \"$2\""
}

function start_all_crawlers_for_city() {
  reset_hosts
  set -e
  start_crawler_for_city "doordash" "$1"
  start_crawler_for_city "google" "$1"
  start_crawler_for_city "grubhub" "$1"
  start_crawler_for_city "infatuated" "$1"
  start_crawler_for_city "tripadvisor" "$1"
  start_crawler_for_city "yelp" "$1"
  start_crawler_for_city "ubereats" "$1"
}

function start_all_crawlers() {
  set -e
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

function crawl_self() {
  echo "Running self crawler"
  worker_exec "node /app/services/crawlers/dist/self/all.js"
}

function crawl_self_by_query() {
  [ -z "$1" ] && exit 1
  query="SELECT id FROM restaurant $1"
  echo "Running self crawler with SQL: $query"
  worker_exec "RUN=1 QUERY=${query@Q} node /app/services/crawlers/dist/self/one.js"
}

function crawl_self_sf_limited_cuisine() {
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
  crawl_self_by_query "$query"
}

function redis_command() {
  kubectl exec \
    redis-master-0 -n redis -c redis \
    -- bash -c "echo ${1@Q} | redis-cli"
}

function redis_cli() {
  fly_tunnel
  redis-cli -h "$REDIS_HOST" -a "$REDIS_PASSWORD" -p 10000 "$@"
}

function redis_cli_list_all() {
  redis_cli keys "\*"
}

function redis_flush_all() {
  redis_command 'FLUSHALL'
}

function umami_migrate() {
  psql "$POSTGRES_URL" < services/umami/setup.sql
}

function db_migrate() {
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
}

function timescale_migrate() {
  echo "Migrating timescale"
  pushd "$PROJECT_ROOT/services/timescale"
  npm install &> /dev/null || true
  node ./scripts/migrate.js
  popd
}

function hasura_admin() {
  (cd services/hasura && hasura console --endpoint http://localhost:8080 --admin-secret=$HASURA_GRAPHQL_ADMIN_SECRET)
}

function hasura_migrate() {
  echo "migrating hasura"
  db_migrate
  echo "cat init (disbaled until i can fix on tests)"
  # pushd "$PROJECT_ROOT/services/hasura"
  # PGPASSWORD=$POSTGRES_PASSWORD cat functions/*.sql | \
  #   psql \
  #   -p "$POSTGRES_PORT" \
  #   -h localhost \
  #   -U "${POSTGRES_USER:-postgres}" \
  #   -d "${POSTGRES_DB:-dish}" \
  #   --single-transaction
  # popd
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
  PGPASSWORD="$POSTGRES_PASSWORD" psql \
    -h "$POSTGRES_HOST" \
    -U postgres \
    -d "${POSTGRES_DB:-dish}" \
    -c "$copy_out" \
  | s3 put - "$DISH_BACKUP_BUCKET/scrape.csv"
  echo "...scrape table dumped tpo S3."
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

function dish_app_generate_tags() {
  export HASURA_ENDPOINT=https://hasura.dishapp.com
  export IS_LIVE=1
  pushd $PROJECT_ROOT/dish-app
  node -r esbuild-register ./etc/generate_tags.ts
}

function s3() {
  s3cmd \
    --host sfo2.digitaloceanspaces.com \
    --host-bucket '%(bucket).sfo2.digitaloceanspaces.com' \
    --access_key "$DO_SPACES_ID" \
    --secret_key "$DO_SPACES_SECRET" \
    --human-readable-sizes \
    "$@"
}

function list_backups() {
  s3 ls "$DISH_BACKUP_BUCKET" | sort -k1,2
}

function backup_main_db() {
  set -e
  echo "backing up main db..."
  # _setup_s3
  DUMP_FILE_NAME="dish-db-backup-`date +%Y-%m-%d-%H-%M`.dump"
  pg_dump "$POSTGRES_URL" \
    -C -w --format=c | \
    s3 put - "s3://dish-backups/$DUMP_FILE_NAME"
  echo 'Successfully backed up main database'
}

function backup_scrape_db() {
  set -e
  echo "backing up scrape db..."
  _setup_s3
  DUMP_FILE_NAME="dish-scrape-backup-`date +%Y-%m-%d-%H-%M`.dump"
  pg_dump $TIMESCALE_FLY_POSTGRES_URL -C -w --format=c | \
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
  # POSTGRES_PASSWORD=postgres pg_restore -h localhost -U postgres -p 5432 -d dish "$dump_file"
}

restore_latest_scrapes_backup_to_local() {
  latest_backup=$(get_latest_scrape_backup)
  dump_file="/tmp/latest_scrape_backup.dump"
  s3 get "$latest_backup" "$dump_file"
  POSTGRES_PASSWORD=postgres pg_restore -h localhost -U postgres -p 5433 -d dish "$dump_file"
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
  cat backup.dump | POSTGRES_PASSWORD=$POSTGRES_PASSWORD pg_restore \
    -h $POSTGRES_HOST \
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
  cat backup.dump | POSTGRES_PASSWORD=$POSTGRES_PASSWORD pg_restore \
    -h $TIMESCALE_HOST \
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

function main_db_command() {
  if [ "$POSTGRES_URL" = "" ]; then
    echo "no url given"
  fi
  echo "$1" | psql "$POSTGRES_URL" -P pager=off -P format=unaligned
}

function fly_tunnel() {
  if dig _apps.internal | grep -q 'dish-'; then
    echo "tunneled into fly"
  else
    fly ssh issue dish teamdishapp@gmail.com --agent
    echo "May need to setup wireguard setup: https://fly.io/docs/reference/privatenetwork/"
  fi
}

function console() {
  ssh "root@$1.internal"
}

function find_app() {
  find "$PROJECT_ROOT" -type d \( -name node_modules -o -name packages -o -name dist -o -name _ -o -name src \) -prune -false -o -type d -name "$1" | head -n 1
}

function logs() {
  pushd "$(find_app $1)"
  fly logs
  popd
}

function bull_clear() {
  curl -X POST https://dish-worker.fly.dev/clear
}

function bull_repl() {
  if [ "$1" = "" ]; then
    echo "Must specify a queue"
    echo "  its the constructor name of any class that extends WorkerJob"
    echo "  for example (at time of writing this)"
    echo "    Yelp, UberEats, GoogleReviewAPI, GooglePuppeteer, GoogleImages..."
    exit 0
  fi
  fly_tunnel
  "$PROJECT_ROOT/node_modules/.bin/bull-repl" connect \
      --host dish-redis.fly.dev \
      --port 10000 \
      --password redis \
      "$1"
}

function gorse_status() {
  _run_on_cluster alpine && return 0
  apk add --no-cache curl
  curl http://gorse:9000/status
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

function urlencode() {
  singles=${1//\'/\\\'}
  python -c "import sys, urllib.parse as ul; print(ul.quote('$singles'))"
}

function bert_sentiment() {
  text=$(urlencode "$1")
  url="https://bert.k8s.dishapp.com/?text=$text"
  curl "$url"
}

function docker_build() {
  docker-compose build "$@"
}

function docker_build_file() {
  docker buildx build --progress=plain --platform linux/amd64 "$@"
}

function docker_compose_up_subset() {
  echo "starting $services"
  services=$1
  extra=$2
  if [ -z "$extra" ]; then
    log_command -- docker-compose up --force-recreate --remove-orphans $services
  else
    log_command -- docker-compose up --force-recreate --remove-orphans "$extra" $services
  fi
  printf "\n\n\n"
}

function docker_compose_up() {
  services_list="$COMPOSE_EXCLUDE${COMPOSE_EXCLUDE_EXTRA:-}"
  services=$(
    docker-compose config --services 2> /dev/null \
      | grep -E -v "$services_list" \
      | tr '\r\n' ' '
  )
  echo "docker_compose_up: $DB_DATA_DIR $DISH_IMAGE_TAG $POSTGRES_DB $HASURA_PORT"
  # cleans up misbehaving old containers
  if [ "$DISH_ENV" = "test" ]; then
    for service in $services; do
      docker-compose rm --force "$service" || true
    done
  fi
  docker_compose_up_subset "$services" "$@"
}

function deploy_all() {
  set -e
  where=${1:-registry}
  # make them all background so we can handle them the same
  echo "deploying apps via $where"
  # deploy "$where" redis | sed -e 's/^/redis: /;' &
  # deploy "$where" hooks | sed -e 's/^/hooks: /;' &
  # runs on dedicated now
  # runs on dedicated now
  # deploy "$where" db | sed -e 's/^/db: /;' &
  # wait
  # depends on postgres
  # depends on hooks
  # deploy "$where" hasura | sed -e 's/^/hasura: /;' &
  # wait
   # depends on hasura
  # deploy "$where" tileserver | sed -e 's/^/tileserver: /;' &
  deploy "$where" timescale | sed -e 's/^/timescale: /;' &
  wait
  # deploy "$where" pg-admin | sed -e 's/^/pg-admin: /;' &
  # deploy "$where" worker-proxy | sed -e 's/^/worker-proxy: /;' &
  # deploy "$where" app | sed -e 's/^/app: /;' &
  # deploy "$where" search | sed -e 's/^/search: /;' &
  # deploy "$where" worker | sed -e 's/^/worker: /;' &
  # deploy "$where" image-quality | sed -e 's/^/image-quality: /;' &
  # deploy "$where" image-proxy | sed -e 's/^/image-proxy: /;' &
  deploy "$where" image-recognize | sed -e 's/^/image-recognize: /;' &
  # disabled until fixed with fly
  # deploy "$where" bert | sed -e 's/^/bert: /;' &
  deploy "$where" cron | sed -e 's/^/cron: /;' &
  # deploy "$where" site | sed -e 's/^/site: /;' &
  wait
}

function build() {
  docker-compose build "$@"
}

function deploy() {
  where=${1:-registry}
  app=$2
  # todo begrudingly learn bash
  if [ "$app" = "" ]; then exit 1; fi
  if [ "$app" = "app" ];              then deploy_fly_app "$where" dish-app dish-app dish-app; fi
  if [ "$app" = "hasura" ];           then deploy_fly_app "$where" dish-hasura services/hasura hasura; fi
  if [ "$app" = "db" ];               then deploy_fly_app "$where" dish-db services/db db; fi
  if [ "$app" = "search" ];           then deploy_fly_app "$where" dish-search services/search search; fi
  if [ "$app" = "timescale" ];        then deploy_fly_app "$where" dish-timescale services/timescale timescale; fi
  if [ "$app" = "pg-admin" ];         then deploy_fly_app "$where" dish-pg-admin services/pg-admin pg-admin; fi
  if [ "$app" = "tileserver" ];       then deploy_fly_app "$where" dish-tileserver services/tileserver tileserver; fi
  if [ "$app" = "hooks" ];            then deploy_fly_app "$where" dish-hooks services/hooks dish-hooks; fi
  if [ "$app" = "worker" ];           then deploy_fly_app "$where" dish-worker services/worker worker; fi
  if [ "$app" = "image-quality" ];    then deploy_fly_app "$where" dish-image-quality services/image-quality image-quality; fi
  if [ "$app" = "image-recognize" ];  then deploy_fly_app "$where" dish-image-recognize services/image-recognize image-recognize; fi
  if [ "$app" = "image-proxy" ];      then deploy_fly_app "$where" dish-image-proxy services/image-proxy image-proxy; fi
  if [ "$app" = "bert" ];             then deploy_fly_app "$where" dish-bert services/bert bert; fi
  if [ "$app" = "hooks" ];            then deploy_fly_app "$where" dish-hooks services/hooks hooks; fi
  if [ "$app" = "cron" ];             then deploy_fly_app "$where" dish-cron services/cron cron; fi
  if [ "$app" = "redis" ];            then deploy_fly_app "$where" dish-redis services/redis redis; fi
  if [ "$app" = "run-tests" ];        then deploy_fly_app "$where" dish-run-tests services/run-tests run-tests; fi
  if [ "$app" = "worker-proxy" ];     then deploy_fly_app "$where" dish-proxy services/worker-proxy worker-proxy; fi
  if [ "$app" = "site" ];             then deploy_fly_app "$where" dish-site services/site site; fi
}

function deploy_fail() {
  echo "Error: deploy failed due to exit code 😭😭😭"
  exit 1
}

function deploy_fly_app() {
  trap 'deploy_fail && trap - SIGTERM && kill -- -$$' SIGINT SIGTERM EXIT
  where=$1
  app=$2
  folder=$3
  log_file="$(pwd)/deploy-$app.log"
  pre_deploy_logs="$(pwd)/pre-deploy-$app.log"
  rm "$log_file" &> /dev/null || true
  tag=${5:-latest}
  echo ">>>> deploying $app in $folder with tag $tag"
  pushd "$folder"
  if [ -f ".ci/pre_deploy.sh" ]; then
    echo " >> running pre-deploy script $app..."
    touch "$pre_deploy_logs"
    .ci/pre_deploy.sh &> "$pre_deploy_logs" &
    pre_deploy_pid=$!
    tail -f "$pre_deploy_logs" &
    pre_tail_pid=$!
    wait $pre_deploy_pid
    kill $pre_tail_pid || true
    printf " >> done pre_deploy\n\n"
    if grep "is being deployed" < "$pre_deploy_logs"; then
      if grep "failed" < "$pre_deploy_logs"; then
        exit 1
      else
        return
      fi
    fi
  fi
  if [ "$where" = "registry" ]; then
    did_kill_idempotent=0
    echo " >> deploy..."
    touch "$log_file"
    tail -f "$log_file" &
    tail_pid=$!
    flyctl deploy --strategy rolling -i registry.fly.io/$app:$tag > "$log_file" 2>&1 &
    pid=$!
    while ps | grep "$pid " > /dev/null; do
      # bugfix fly not deploying if same for now
      if grep 'Release v0 created' < "$log_file"; then
        echo " >> detected idempotent release that will hang (fly issue), continue..."
        did_kill_idempotent=1
        break
      elif grep ' deployed successfully' < "$log_file"; then
        echo " >> deployed, killing since it hangs sometimes on success..."
        break
      else
        sleep 3
      fi
    done
    kill $pid || true
    kill $tail_pid || true
    my_status=$?
    if [[ $did_kill_idempotent -eq 1 ||  $my_status -eq 0 ]]; then
      echo " >> done deploying"
    else
      echo " >> deploy issue $app $did_kill_idempotent $my_status"
      exit 1
    fi
  else
    # local
    flyctl deploy --remote-only --strategy rolling
  fi
  if [ -f ".ci/post_deploy.sh" ]; then
    echo " >> post-deploy script $app..."
    .ci/post_deploy.sh
  fi
  # echo $(jobs -p)
  echo " >> 🚀 $app "
  popd
}

function clean_docker_if_disk_full() {
  echo "checking if disk near full..."
  df -H | grep overlay | head -n 1 | awk '{ print $5 " " $1 }' | while read output;
  do
    used=$(echo "$output" | awk '{ print $1}' | cut -d'%' -f1)
    echo "$output used $used"
    if [ "$used" -ge 90 ]; then
      echo "running out of space, pruning..."
      if [ "$CLEAN_BUILDKITE_BUILDS" == "true" ]; then
        rm -r "/var/lib/buildkite/builds/*" || true
      fi
      docker image prune --all --filter "until=2h" --force || true
      docker system prune --filter "until=2h" --force || true
      docker volume prune --force || true
      break
    fi
  done
  df -H | grep overlay | awk '{ print $5 " " $1 }' | while read output;
  do
    used=$(echo "$output" | awk '{ print $1}' | cut -d'%' -f1)
    if [ "$used" -ge 90 ]; then
      echo "really full, delete all.."
      docker system prune
      docker image prune --all
      rm -r /var/lib/buildkite/builds
      break
    fi
  done
}

function is_hasura_up() {
  [ $(curl -L $HASURA_ENDPOINT/healthz -o /dev/null -w '%{http_code}\n' -s) == "200" ]
}
export -f is_hasura_up
function is_dish_up() {
  [ $(curl -L $DISH_ENDPOINT/healthz -o /dev/null -w '%{http_code}\n' -s) == "200" ]
}
export -f is_dish_up

function wait_until_hasura_ready() {
  echo "Waiting for Hasura to start ($HASURA_ENDPOINT)..."
  until is_hasura_up; do sleep 0.1; done
  echo "Hasura is up"
}
export -f wait_until_hasura_ready

function wait_until_dish_app_ready() {
  echo "Waiting for dish to start ($DISH_ENDPOINT)..."
  until is_dish_up; do sleep 0.1; done
  echo "dish is up"
}
export -f wait_until_dish_app_ready

function wait_until_services_ready() {
  echo "Waiting for hasura to finish starting"
  if ! timeout --preserve-status 30 bash -c wait_until_hasura_ready; then
    echo "Timed out waiting for Hasura container to start"
    exit 1
  fi
  echo "Waiting for dish-app to finish starting"
  if ! timeout --preserve-status 30 bash -c wait_until_dish_app_ready; then
    echo "Timed out waiting for dish container to start"
    exit 1
  fi
}

function clean_build() {
  find $PROJECT_ROOT -type d \( -name node_modules \) -prune -false -o -name "_" -type d -prune -exec rm -rf '{}' \; &
  find $PROJECT_ROOT -type d \( -name node_modules \) -prune -false -o -name "dist" -type d -prune -exec rm -rf '{}' \; &
  find $PROJECT_ROOT -type d \( -name node_modules \) -prune -false -o -name "tsconfig.tsbuildinfo" -prune -exec rm -rf '{}' \; &
  find $PROJECT_ROOT -type d \( -name node_modules \) -prune -false -o -name ".ultra.cache.json" -prune -exec rm -rf '{}' \; &
  wait
}

function clean() {
  clean_build
  find $PROJECT_ROOT -name "node_modules" -type d -prune -exec rm -rf '{}' \;
  find $PROJECT_ROOT -name "yarn-error.log" -prune -exec rm -rf '{}' \;
}

function run() {
  bash -c "$@"
}

if command -v git &> /dev/null; then
  export PROJECT_ROOT=$(git rev-parse --show-toplevel)
  # branch=$(git rev-parse --abbrev-ref HEAD)
  # export DOCKER_TAG_NAMESPACE=${branch//\//-}
  # export BASE_IMAGE=$DISH_REGISTRY/base:$DOCKER_TAG_NAMESPACE
  pushd $PROJECT_ROOT >/dev/null
  set -a
  source .env
  arch="$(uname -m)"
  if [ "${arch}" = "arm64" ]; then
    echo "using env m1"
    source .env.m1
  fi
  # source current env next, .env.production by default
  if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
  else
    echo "Not loading ENV from $ENV_FILE as it doesn't exist"
  fi
  set +a
  popd >/dev/null
else
  echo "Not loading ENV as there's no \`git\` command"
  export all_env="$(env)"
fi

function_to_run=$1
shift
ORIGINAL_ARGS="$@"
$function_to_run "$@"

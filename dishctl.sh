#!/bin/bash

eval $(bin/yaml_to_env.sh)
POSTGRES_HOST=postgres-ha-postgresql-ha-pgpool.postgres-ha
TIMESCALE_HOST=timescale.timescale
function_to_run=$1

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
  TIMESCALE_PG_PASS=$(timescale_pg_password)
  worker "$(cat <<-END
    set -e
    apt-get update
    apt-get install -y gnupg
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
    echo "deb http://apt.postgresql.org/pub/repos/apt/ \`lsb_release -cs\`-pgdg main" \
      | tee /etc/apt/sources.list.d/pgdg.list
    apt-get update
    apt-get install postgresql-client-12 -y
    PGPASSWORD=$TF_VAR_POSTGRES_PASSWORD psql \
      -h $POSTGRES_HOST \
      -U postgres \
      -d dish \
      -c "copy (select \
        created_at, \
        source, \
        id_from_source, \
        restaurant_id, \
        location, \
        data \
        from scrape \
      ) \
      to stdout with csv" \
    | \
    PGPASSWORD=$TIMESCALE_PG_PASS psql \
      --set=sslmode=require \
      -h $TIMESCALE_HOST \
      -U postgres \
      -d scrape_data \
      -c "copy scrape (
        time, \
        source, \
        id_from_source, \
        restaurant_id, \
        location, \
        data \
      ) from stdin csv"
END
)"
}

function redis_flush_all() {
  kubectl exec -it \
    redis-master-0 -n redis -c redis \
    -- bash -c 'redis-cli -c "FLUSHALL"'
}

$function_to_run "$@"

#!/bin/bash

function stop_all_crawls() {
  curl -X 'POST' https://worker.dishapp.com/clear -H 'queues: all'
}

# comma separated
function stop_crawl() {
  curl -X 'POST' https://worker.dishapp.com/clear -H "queues: $@"
}

# Note that crawlers are also run on cron schedules.
# For cities list see: crawlers/src/utils "CITY_LIST"

# example: ./dsh start_crawler Yelp
function start_crawler() {
  worker_cli "node /app/services/crawlers/dist/$1/all.js"
}

# example: ./dsh start_crawler_for_city yelp Tucson, Arizona
function start_crawler_for_city() {
  worker_cli "node /app/services/crawlers/dist/$1/all.js --city \"$2\""
}

function crawl_one() {
  slug=$1
  worker_cli "node /app/services/crawlers/dist/one.js $slug"
}

function crawl_self() {
  echo "Running self crawler"
  worker_cli "node /app/services/crawlers/dist/self/all.js"
}

function crawl_self_by_query() {
  [ -z "$1" ] && exit 1
  query="SELECT id FROM restaurant $1"
  echo "Running self crawler with SQL: $query"
  worker_cli "RUN=1 QUERY=${query@Q} node /app/services/crawlers/dist/self/one.js"
}

function start_all_crawlers_for_city() {
  reset_hosts
  set -e
  start_crawler_for_city "doordash" "$1"
  start_crawler_for_city "google" "$1"
  start_crawler_for_city "grubhub" "$1"
  start_crawler_for_city "infatuation" "$1"
  start_crawler_for_city "tripadvisor" "$1"
  start_crawler_for_city "yelp" "$1"
  start_crawler_for_city "ubereats" "$1"
}

function start_all_crawlers() {
  set -e
  start_crawler "doordash"
  start_crawler "google"
  start_crawler "grubhub"
  start_crawler "infatuation"
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
  echo ${1@Q} | redis-cli
}

function redis_cli() {
  redis-cli -h "$REDIS_HOST" -a "$REDIS_PASSWORD" -p "$REDIS_PORT" "$@"
}

function redis_cli_list_all() {
  redis_cli keys "\*"
}

function redis_flush_all() {
  redis_command 'FLUSHALL'
}

function bull_clear_prod() {
  curl -X POST https://worker.dishapp.com/clear
}

function bull_repl() {
  # TODO make this work on our infra
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

function crawler_mem_usage() {
  ps -eo size,pid,usconcer,command --sort -size |
    awk '{ hr=$1/1024 ; printf("%13.2f Mb ",hr) } { for ( x=4 ; x<=NF ; x++ ) { printf("%s ",$x) } print "" }' |
    cut -d "" -f2 |
    cut -d "-" -f1 |
    grep sandbox
}

function yelp_jobs_waiting_count() {
  curl --silent \
    'https://worker.dishapp.com/api/queues?Yelp=waiting&page=1' |
    jq -r '.queues[] | select(.name=="Yelp") | .counts.waiting'
}

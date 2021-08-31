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

function docker_compose_push_core() {
  echo "pushing images..."
  docker push registry.dishapp.com/dish-base | sed -e 's/^/base: /;' &
  docker push registry.dishapp.com/dish-app | sed -e 's/^/app: /;' &
  docker push registry.dishapp.com/dish-hooks | sed -e 's/^/hooks: /;' &
  docker push registry.dishapp.com/dish-site | sed -e 's/^/site: /;' &
  docker push registry.dishapp.com/dish-worker | sed -e 's/^/worker: /;' &
  docker push registry.dishapp.com/dish-puppet-proxy | sed -e 's/^/puppet-proxy: /;' &
  docker push registry.dishapp.com/dish-run-tests | sed -e 's/^/run-tests: /;' &
  wait
}

function deploy_done_notify() {
  echo "notifying slack..."
  # post to slack
  commit=$(git rev-parse HEAD)
  # link="https://github.com/getdish/dish/tree/$commit"
  message="
  Successful deploy of $commit \n
  Code: https://github.com/getdish/dish/tree/$commit \n
  CI Run: $BUILDKITE_BUILD_URL
  "
  ./dsh send_slack_monitoring_message "$message"
}

function deploy_fail() {
  echo "Error: deploy failed due to exit code 😭😭😭"
  exit 1
}

function setup_test_services() {
  echo "setup test services for env $DISH_ENV"
  docker network create traefik-public || true

  # if not already mounted/setup, we need to start postgres once and restart it
  # this is because there are problems where postgres gets corrupted/weird while other services
  # try and access it during init, giving it time to init here and then run later
  if [ ! -d "$POSTGRES_DB_DIR" ]; then
    echo "doing double start first time since no postgres db dir: $POSTGRES_DB_DIR"
    mkdir -p "$POSTGRES_DB_DIR"
    # only for buildkite non-docker mode, brittle
    chown -R buildkite-agent:buildkite-agent "$POSTGRES_DB_DIR"
    docker-compose run -d postgres
    echo "sourcing local env"
    source .env.local
    wait_until_postgres_ready
  fi

  echo "stopping"
  docker-compose stop -t 4 || echo "error stopping"

  source_env
  echo "running"
  compose_up -d

  echo "sourcing local to check and migrate"
  source .env.local
  wait_until_services_ready

  # TODO migrate on start method
  migrate_all

  echo "done"
}

function run_all_tests() {
  docker run \
    --net host \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$POSTGRES_DB_DIR:$POSTGRES_DB_DIR" \
    -v "$TIMESCALE_DB_DIR:$TIMESCALE_DB_DIR" \
    registry.dishapp.com/dish-run-tests:latest yarn test
}

function run_all_tests_in_compose() {
  exec migrate yarn test
}

function run_all_tests_in_compose_retry() {
  # this just runs it inside the `dish-migrate` container which is idle
  exec migrate yarn test
  # if you want to retry on failed (too course, we should retry just the http stuff really)
  # || (echo "failed, retrying" && exec migrate yarn test)
}

function run_integration_tests() {
  echo "Running Test Cafe end-to-end browser-based tests..."
  pushd app
  docker run -d --net=host --name "app-integration-tests-$BUILDKITE_BUILD_NUMBER" "$DISH_REGISTRY/app"
  sleep 5
  ./test/testcafe.sh
  popd
}

function docker_login() {
  docker login registry.dishapp.com -u "$TRAEFIK_USERNAME" -p "$TRAEFIK_PASSWORD_PLAIN" || echo "login exit 1 but it succeeds sometimes?"
}

function run_dsh() {
  esbuild ./dsh.ts --target=node15 --format=esm --outdir=node_modules/.cache --out-extension:.js=.mjs &>/dev/null
  node ./node_modules/.bin/zx ./node_modules/.cache/dsh.mjs
}

function wait_until_hasura_ready() {
  echo "Waiting for Hasura to start ($HASURA_ENDPOINT)..."
  until [ $(curl -L $HASURA_ENDPOINT/healthz -o /dev/null -w '%{http_code}\n' -s) == "200" ]; do
    sleep 0.1
  done
  echo "Hasura is up"
}
export -f wait_until_hasura_ready

function wait_until_postgres_ready() {
  echo "Waiting for Postgres to start ($POSTGRES_ENDPOINT)..."
  until [ $(curl -L $POSTGRES_ENDPOINT -o /dev/null -w '%{http_code}\n' -s) == "000" ]; do
    sleep 0.1
  done
  echo "Postgres is up"
}
export -f wait_until_postgres_ready

function wait_until_timescale_ready() {
  echo "Waiting for Timescale to start ($TIMESCALE_ENDPOINT)..."
  until [ $(curl -L $TIMESCALE_ENDPOINT -o /dev/null -w '%{http_code}\n' -s) == "000" ]; do
    sleep 0.1
  done
  echo "Timescale is up"
}
export -f wait_until_timescale_ready

function wait_until_dish_app_ready() {
  echo "Waiting for dish to start ($DISH_ENDPOINT)..."
  until [ $(curl -L $DISH_ENDPOINT/healthz -o /dev/null -w '%{http_code}\n' -s) == "200" ]; do
    sleep 0.1
  done
  echo "dish is up"
}
export -f wait_until_dish_app_ready

function wait_until_services_ready() {
  echo "Waiting for hasura to finish starting"
  if ! timeout --preserve-status 15 bash -c wait_until_hasura_ready; then
    echo "Timed out waiting for Hasura container to start"
    exit 1
  fi
  echo "Waiting for timescale to finish starting"
  if ! timeout --preserve-status 15 bash -c wait_until_timescale_ready; then
    echo "Timed out waiting for Timescale container to start"
    exit 1
  fi
}

function wait_until_app_ready() {
  echo "Waiting for app to finish starting"
  # could use this later, separate
  # if ! timeout --preserve-status 15 bash -c wait_until_dish_app_ready; then
  #   echo "Timed out waiting for dish container to start"
  #   exit 1
  # fi
}

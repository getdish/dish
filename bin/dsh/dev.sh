#!/bin/bash

# runs everything all in one
# mac m1 only for now but not hard to adapt
function dev() {
  function ctrl_c() {
      echo "👋 BYE"
      kill -KILL "$PID1" "$PID2" "$PID3" "$PID4" "$PID5" "$PID6" 2> /dev/null
  }

  trap ctrl_c INT SIGINT

  # start postgres
  if dev_get_pg_status | grep -q 'no server running'; then
    open -a Postgres
    sleep 1
    echo "✅ started postgres"
  else
    echo "✅ postgres running"
  fi

  if [[ "$ORIGINAL_ARGS" == *"--local"* ]]; then
    # no docker just run bare minimum directly

    # hasura
    echo "running hasura server"
    HASURA_GRAPHQL_DATABASE_URL=${HASURA_GRAPHQL_DATABASE_URL} HASURA_GRAPHQL_ENABLE_CONSOLE=false ./services/hasura/bin/graphql-engine serve  --server-port 8091 &
    PID1=$!

    # tileserver
    DATABASE_URL=${POSTGRES_URL_INTERNAL} ./services/tileserver/bin/martin --listen-addresses=0.0.0.0:3005 &
    PID2=$!
  else
    # # start docker / compose
    if [[ -z "$(! docker stats --no-stream 2> /dev/null)" ]]; then
      dev_start_docker_then_compose &
      PID1=$!
    else
      compose_up &
      PID1=$!
    fi
    echo "✅ started docker"
  fi

  if [[ "$ORIGINAL_ARGS" == *"--backend"* ]]; then
    echo "started backend"
  else
    if [ "$ORIGINAL_ARGS" = "--prod" ] || [ "$DISH_ENV" = "production" ]; then
      echo "✅ start app (web production) $ORIGINAL_ARGS"
      yarn web:prod &
    else
      echo "✅ start app (web) $ORIGINAL_ARGS"
      yarn web &
    fi
    PID4=$!

    if [[ "$ORIGINAL_ARGS" == *"--skip-native"* ]]; then
      echo "skipping native"
    else
      echo "✅ start app (native)"
      yarn app &
      PID5=$!
    fi
  fi

  # start watch after to let things start quicker
  sleep 5

  # local mode run console (after server starts)
  if [[ "$ORIGINAL_ARGS" == *"--local"* ]]; then
    # hasura console (has to run separately and in serviecs/hasura for migrations to work)
    pushd ./services/hasura || exit 1
    HASURA_GRAPHQL_DATABASE_URL=${HASURA_GRAPHQL_DATABASE_URL} hasura console --endpoint "http://localhost:8091" --no-browser &
    PID6=$!
    popd || exit 1
  fi

  echo "✅ yarn watch"
  yarn watch &
  PID3=$!

  wait
}

function dev_get_pg_status() {
  PGDATA="$POSTGRES_DATA_DIR" log_command pg_ctl status
}

function dev_start_docker() {
  printf "Starting Docker for Mac";
  open -a Docker;
  while [[ -z "$(! docker stats --no-stream 2> /dev/null)" ]];
    do printf ".";
    sleep 1
  done
  echo "";
}

function dev_start_docker_then_compose() {
  dev_start_docker
  compose_up
}

function run() {
  set -a
  source_env
  if [ "$1" = "native" ]; then
    run_native_app
  else
    if [ "$DISH_DEBUG" -gt "2" ]; then
      echo "executing: $ORIGINAL_ARGS in $CWD_DIR"
    fi
    pushd "$CWD_DIR"
    bash -c "$ORIGINAL_ARGS"
    popd
  fi
}

function run_native_app() {
  pushd app
  DISH_DEBUG=1 LOCAL_HOST=$(ipconfig getifaddr en0) LOG_LEVEL=1 TAMAGUI_TARGET=native ../node_modules/.bin/react-native start --reset-cache
  popd
}

function docker_exec() {
  app=${1:-app}
  shift
  cmd=$*
  echo "exec $app: running $cmd"
  docker exec -it $(docker ps | grep $app | head -n1 | awk '{print $1}') $cmd
}

function dish_app_generate_tags() {
  export HASURA_ENDPOINT=https://hasura.dishapp.com
  export IS_LIVE=1
  pushd $PROJECT_ROOT/app
  node -r esbuild-register ./etc/generate_tags.ts
}

function find_app() {
  find "$PROJECT_ROOT" -type d \( -name node_modules -o -name packages -o -name dist -o -name _ -o -name src \) -prune -false -o -type d -name "$1" | head -n 1
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

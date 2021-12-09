#!/bin/bash

function run() {
  set -a
  source_env
  if [ "$DISH_DEBUG" -gt "2" ]; then
    echo "executing: $ORIGINAL_ARGS in $CWD_DIR"
  fi
  pushd "$CWD_DIR"
  bash -c "$ORIGINAL_ARGS"
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

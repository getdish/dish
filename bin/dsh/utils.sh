#!/bin/bash

function generate_random_port() {
  echo "2$((1000 + RANDOM % 8999))"
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

function disk_speed() {
  dd if=/dev/zero of=/tmp/test2.img bs=512 count=100 oflag=dsync
}

function source_env() {
  source .env
  arch="$(uname -m)"
  # source current env next, .env.production by default
  if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
  else
    echo "Not loading ENV from $ENV_FILE as it doesn't exist"
  fi
  if [ "${arch}" = "arm64" ]; then
    echo "sourcing m1"
    source .env.m1
  fi
  if [ "$IS_LOCAL" = "1" ]; then
    echo "sourcing local"
    source .env.local
  fi
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

function pushd() {
  command pushd "$@" >/dev/null
}

function popd() {
  command popd "$@" >/dev/null
}

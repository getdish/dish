#!/bin/bash

DIR=$(dirname "$0")

function prune() {
  $DIR/prune_gcr.py --project dish-258800 --keep-at-least 20 $1
}

echo "pruning old gcr images..."

prune base &
prune bert &
prune build-cache &
prune dish &
prune dish-app &
prune run-tests &
prune dish-hooks &
prune gorse &
prune hasura &
prune image-proxy &
prune image-quality &
prune image-quality-server &
prune imageproxy &
prune postgres &
prune db &
prune postgres-simple &
prune redis &
prune search &
prune test &
prune tileserver &
prune timescaledb &
prune user-server &
prune work &
wait

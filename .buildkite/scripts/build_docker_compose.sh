#!/bin/bash

set -e

function clean_dangling() {
  # remove dangling images which can mess up pull/push
  docker rmi --force $(docker images --filter "dangling=true" -q --no-trunc) || true
}

docker-compose build "$@"

if [ "$PUSH" = "true" ]; then
  # tries again once if failed
  docker-compose push "$@" || clean_dangling || docker-compose push "$@"
fi

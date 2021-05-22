#!/bin/bash

set -eo pipefail

function clean_dangling() {
  ./dsh docker_registry_gc
  # remove dangling images which can mess up pull/push
  docker rmi $(docker images --filter "dangling=true" -q --no-trunc) || true
}

if [ "$INTERNAL" = "true" ]; then
  docker-compose -f docker-internal.yml build "$@" || \
    echo "retry" && clean_dangling && docker-compose -f docker-internal.yml build "$@" 
else
  docker-compose build "$@" || \
    echo "retry" && clean_dangling && docker-compose build "$@"
fi

if [ "$PUSH" = "true" ]; then
  # tries again once if failed
  docker-compose push "$@" || clean_dangling || docker-compose push "$@"
fi

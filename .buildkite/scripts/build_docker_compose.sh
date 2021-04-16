#!/bin/bash

set -e

docker-compose build "$@"

if [ "$PUSH" = "true" ]; then
  # tries again once if failed
  docker-compose push "$@" || docker-compose push "$@"
fi

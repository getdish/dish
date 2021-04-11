#!/bin/bash

set -e

docker-compose build "$@"

if [ "$PUSH" = "true" ]; then
  docker-compose push "$@"
fi

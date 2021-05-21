#!/usr/bin/env bash

set -eo pipefail

set -a
source .env
source .env.test
set +a

# if not already mounted/setup, we need to start postgres once and restart it
if [ ! -d "/var/data/postgres/test" ]; then
  echo "doing double start first time"
  docker-compose run -d postgres
  sleep 10
  docker-compose down --remove-orphans -t 4
fi

./dsh docker_compose_up -d
./dsh wait_until_services_ready
./dsh migrate

echo "done"

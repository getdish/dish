#!/usr/bin/env bash

set -eo pipefail

source .env
source .env.test

# if not already mounted/setup, we need to start postgres once and restart it
if [ ! -d "/var/data/postgres/test" ]; then
  echo "doing double start first time"
  docker-compose run -d postgres
  sleep 10
  docker-compose down --remove-orphans -t 4
fi

# fixes issues of not allowing connecting during tests
if [ -d "$HOME/.dish/postgresdb/test" ]; then
  conf="$HOME/.dish/postgresdb/test/pg_hba.conf"
  grep -qxF 'host all all all trust' "$conf" || echo 'host all all all trust' >> "$conf"
fi
if [ -d "$HOME/.dish/timescaledb/test" ]; then
  conf="$HOME/.dish/timescaledb/test/pg_hba.conf"
  grep -qxF 'host all all all trust' "$conf" || echo 'host all all all trust' >> "$conf"
fi

./dsh docker_compose_up -d
./dsh wait_until_services_ready
./dsh migrate

echo "done"

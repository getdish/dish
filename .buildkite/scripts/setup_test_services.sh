#!/usr/bin/env bash

set -eo pipefail

source .env
source .env.test

docker network create traefik-public || true

# if not already mounted/setup, we need to start postgres once and restart it
# this is because there are problems where postgres gets corrupted/weird while other services
# try and access it during init, giving it time to init here and then run later
if [ ! -d "$POSTGRES_DB_DIR" ]; then
  echo "doing double start first time since no postgres db dir: $POSTGRES_DB_DIR"
  docker-compose run -d postgres
  sleep 10
  docker-compose down --remove-orphans -t 4
  docker-compose logs postgres
fi

# fixes issues of not allowing connecting during tests
if [ -d "$POSTGRES_DB_DIR" ]; then
  conf="$POSTGRES_DB_DIR/pg_hba.conf"
  grep -qxF 'host all all all trust' "$conf" || echo 'host all all all trust' >> "$conf"
fi
if [ -d "$TIMESCALE_DB_DIR" ]; then
  conf="$TIMESCALE_DB_DIR/pg_hba.conf"
  grep -qxF 'host all all all trust' "$conf" || echo 'host all all all trust' >> "$conf"
fi

./dsh docker_compose_up -d
./dsh wait_until_services_ready
./dsh migrate

echo "done"

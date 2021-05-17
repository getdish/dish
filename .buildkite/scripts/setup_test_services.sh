#!/usr/bin/env bash

set -eo pipefail

export DISH_ENV=test

set -a
source .env
source .env.test
set +a

mkdir -p "/data/postgresdb"
chown -R root:root "/data/postgresdb"
echo "POSTGRES_DB: $POSTGRES_DB"

echo "Starting docker for $DISH_ENV"

DB_DATA_DIR="/data/postgresdb/" \
./dishctl.sh docker_compose_up -d

./dishctl.sh wait_until_services_ready
./dishctl.sh hasura_migrate
./dishctl.sh timescale_migrate

echo "done"

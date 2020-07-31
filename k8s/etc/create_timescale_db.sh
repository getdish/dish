#!/bin/bash

set -e

PROJECT_ROOT=$(git rev-parse --show-toplevel)
PORT=15439

kubectl port-forward pod/timescale-timescaledb-0 $PORT:5432 -n timescale &
pid=$!
function finish {
  kill $pid
}
trap finish EXIT
sleep 5

export PGPASSWORD=$(
  kubectl get secret \
    --namespace timescale \
    timescale-credentials \
    -o jsonpath="{.data.PATRONI_SUPERUSER_PASSWORD}" \
    | base64 --decode
)

SQL="
  CREATE DATABASE scrape_data;
"

echo $SQL | psql -p $PORT -h localhost -U postgres

pushd $PROJECT_ROOT/services/timescaledb
PG_PORT=$PORT PG_PASS=$PGPASSWORD ./migrate.sh
popd

kill $pid

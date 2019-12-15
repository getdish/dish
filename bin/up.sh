#!/bin/bash

. $(dirname $0)/script-utils.sh
cd $ROOT

set -e

SERVICES=("hasura" "postgres" "redis")

echo "up"
rio up &

for service in "${SERVICES[@]}"; do
  echo "up $service"
  (cd services/$service && rio up) &
done

wait

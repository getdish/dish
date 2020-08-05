#!/bin/bash

PROJECT_ROOT=$(git rev-parse --show-toplevel)

if [[ $DISH_ENV == 'production' ]]; then
  USE_SSL=true
else
  USE_SSL=false
fi

pushd $PROJECT_ROOT/services/timescaledb
$PROJECT_ROOT/node_modules/.bin/postgrator \
  --host ${PG_HOST:-localhost} \
  --port ${PG_PORT:-5433} \
  --database ${PG_DATABASE:-scrape_data} \
  --username ${PG_USER:-postgres} \
  --password ${PG_PASS:-postgres}
popd

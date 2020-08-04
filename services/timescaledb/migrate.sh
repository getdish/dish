#!/bin/bash

PROJECT_ROOT=$(git rev-parse --show-toplevel)

pushd $PROJECT_ROOT/services/timescaledb
USE_SSL=true $PROJECT_ROOT/node_modules/.bin/postgrator \
  --host ${PG_HOST:-localhost} \
  --port ${PG_PORT:-5433} \
  --database ${PG_DATABASE:-scrape_data} \
  --username ${PG_USER:-postgres} \
  --password ${PG_PASS:-postgres}
popd

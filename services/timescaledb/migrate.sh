#!/bin/bash

path="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [[ $DISH_ENV == 'production' ]]; then
  USE_SSL=true
else
  USE_SSL=false
fi

pushd $path
USE_SSL=$USE_SSL ./node_modules/.bin/postgrator \
  --host ${PG_HOST:-localhost} \
  --port ${PG_PORT:-5433} \
  --database ${PG_DATABASE:-scrape_data} \
  --username ${PG_USER:-postgres} \
  --password ${PG_PASS:-postgres}
popd

#!/usr/bin/env bash
set -e pipefail

if [ "$TIMESCALE_FLY_POSTGRES_USER" = "" ]; then
  echo "no env!"
  exit 1
fi

export PG_HOST=TIMESCALE_FLY_POSTGRES_HOST
export PG_PORT=TIMESCALE_FLY_POSTGRES_PORT
export PG_DATABASE=TIMESCALE_FLY_POSTGRES_DB
export PG_USER=TIMESCALE_FLY_POSTGRES_USER
export PG_PASS=TIMESCALE_FLY_POSTGRES_PASS
export DISH_ENV=production

../bin/migrate.sh

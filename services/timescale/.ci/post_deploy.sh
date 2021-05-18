#!/usr/bin/env bash
set -e pipefail

if [ "$TIMESCALE_USER" = "" ]; then
  echo "no env!"
  exit 1
fi

export PG_HOST="$TIMESCALE_HOST"
export PG_PORT="$TIMESCALE_PORT"
export PG_DATABASE="$TIMESCALE_DB"
export PG_USER="$TIMESCALE_USER"
export PG_PASS="$TIMESCALE_PASS"
export DISH_ENV=production

npm install

./scripts/migrate.js

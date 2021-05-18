#!/bin/sh

echo "starting worker..."

if [ "$DISH_ENV" = "development" ]; then
  export CLEAR_JOBS
  ../../dishctl.sh run 'node dist/index.js'
else
  while true; do
    sleep 1800
    killall chrome
  done &
  node --expose-gc ./dist/index.js
fi

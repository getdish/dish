#!/usr/bin/env bash
set -e

docker run \
  -e CI=true \
  --net host \
  dish/worker \
  node _/index.js > worker.logs 2>&1 &

docker run \
  -e CI=true \
  --net host \
  dish/crawlers \
  node _/ci/run.js > crawler.logs 2>&1 &

sleep 15

grep 'CI worker job ran with message: It is done' worker.logs

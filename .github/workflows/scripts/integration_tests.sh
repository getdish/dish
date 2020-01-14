#!/usr/bin/env bash
set -e

docker run \
  -e CI=true \
  --net host \
  dish/crawlers \
  node _/worker.js > worker.logs 2>&1 &

docker run \
  -e CI=true \
  --net host \
  dish/crawlers > crawler.logs 2>&1 &

sleep 5

grep 'UberEats run' worker.logs

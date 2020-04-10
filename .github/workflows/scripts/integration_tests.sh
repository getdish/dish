#!/usr/bin/env bash
set -e

echo "Testing crawler-worker interaction..."
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

echo "Running Test Cafe end-to-end browser-based tests..."

pushd apps/web
docker run -d --net=host dish/web
sleep 5
./test/testcafe.sh
popd

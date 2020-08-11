#!/usr/bin/env bash
set -e

bin/yaml_to_env.sh > _env

sed -e 's/TF_VAR_//' _env > .env

echo "Testing crawler-worker interaction..."
docker run \
  --env-file .env \
  -e CI=true \
  --net host \
  $DISH_REGISTRY/dish/worker > worker.logs 2>&1 &

docker run \
  --env-file .env \
  -e CI=true \
  --net host \
  $DISH_REGISTRY/dish/crawlers \
  bash -c 'node /app/services/crawlers/_/ci/run.js' > crawler.logs 2>&1 &

sleep 15

grep 'CI worker job ran with message: It is done' worker.logs

echo "Running Test Cafe end-to-end browser-based tests..."

pushd apps/web
docker run -d --net=host $DISH_REGISTRY/dish/web
sleep 5
./test/testcafe.sh
popd

#!/usr/bin/env bash
set -e

echo "Testing crawler-worker interaction..."
docker run \
  -e CI=true \
  --net host \
  $DISH_REGISTRY/dish/worker \
  node _/index.js > worker.logs 2>&1 &

docker run \
  -e CI=true \
  --net host \
  $DISH_REGISTRY/dish/crawlers \
  node _/ci/run.js > crawler.logs 2>&1 &

sleep 15

grep 'CI worker job ran with message: It is done' worker.logs

echo "Running Test Cafe end-to-end browser-based tests..."

pushd apps/web
docker run -d --net=host $DISH_REGISTRY/dish/web
sleep 5
./test/testcafe.sh
popd

./k8s/etc/docker_registry_gc.sh

DISH_REGISTRY_PASSWORD=$(\
  grep 'DOCKER_REGISTRY_PASSWORD:' env.enc.production.yaml \
  | tail -n1 | cut -c 27- | tr -d '"'\
)
docker login $DISH_REGISTRY -u dish -p $DISH_REGISTRY_PASSWORD

declare -a images=(
  "web"
  "worker"
  "crawlers"
  "jwt-server"
  "search"
  "backups"
)
for image in "${images[@]}"
do
  docker tag $DISH_REGISTRY/dish/$image $DISH_REGISTRY/dish/$image:ci-green
  docker push $DISH_REGISTRY/dish/$image:ci-green
done


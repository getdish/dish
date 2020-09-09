#!/usr/bin/env bash
set -e

PATH=$PATH:$HOME/bin
export DISH_REGISTRY=docker.k8s.dishapp.com

branch=$(git rev-parse --abbrev-ref HEAD)
export DISH_BASE_VERSION=${branch//\//-}

echo "Using Dish base version: $DISH_BASE_VERSION"

build() {
  path=$1
  name=$(echo $path | cut -d / -f 2)
  NAME=$DISH_REGISTRY/dish/$name
  buildctl \
    --addr tcp://127.0.0.1:1234 \
    build \
      --frontend=dockerfile.v0 \
      --local context=. \
      --local dockerfile=$path \
      --opt build-arg:DISH_BASE_VERSION=$DISH_BASE_VERSION \
      --output type=docker,name=$NAME \
      --export-cache type=inline \
      --import-cache type=registry,ref=$NAME \
  | docker load
}
export -f build

./.github/workflows/scripts/setup_admin.sh
./k8s/etc/docker_registry_gc.sh

echo "Waiting for buildkit connection..."
kubectl port-forward svc/buildkitd 1234:1234 -n docker &
while ! nc -z localhost 1234; do
  sleep 0.1
done
echo "...got buildkit connection."

DISH_REGISTRY_PASSWORD=$(\
  grep 'DOCKER_REGISTRY_PASSWORD:' env.enc.production.yaml \
    | tail -n1 | cut -c 27- | tr -d '"'\
)
echo $DISH_REGISTRY_PASSWORD | docker login $DISH_REGISTRY -u dish --password-stdin

base_name=$DISH_REGISTRY/dish/base:$DISH_BASE_VERSION
buildctl \
  --addr tcp://127.0.0.1:1234 \
  build \
    --frontend=dockerfile.v0 \
    --local context=. \
    --local dockerfile=. \
    --output type=image,name=$base_name,push=true \
    --export-cache type=inline \
    --import-cache type=registry,ref=$base_name

parallel --lb build ::: \
  'services/worker' \
  'services/dish-hooks' \
  'services/gorse' \
  'services/search' \
  'services/jwt-server' \
  'services/cron' \
  'apps/dish-app'

docker images

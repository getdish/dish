#!/usr/bin/env bash
set -e

export DISH_REGISTRY=docker.k8s.dishapp.com

branch=$(git rev-parse --abbrev-ref HEAD)
export DISH_BASE_VERSION=${branch//\//-}

echo "Using Dish base version: $DISH_BASE_VERSION"

build() {
  path=$1
  name=$(echo $path | cut -d / -f 2)
  NAME=$DISH_REGISTRY/dish/$name
  buildctl \
    --addr tcp://buildkit.k8s.dishapp.com:1234 \
    --tlscacert k8s/etc/certs/buildkit/client/ca.pem \
    --tlscert k8s/etc/certs/buildkit/client/cert.pem \
    --tlskey k8s/etc/certs/buildkit/client/key.pem \
    --tlsservername buildkit.k8s.dishapp.com \
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

./k8s/etc/docker_registry_gc.sh

DISH_REGISTRY_PASSWORD=$(\
  grep 'DOCKER_REGISTRY_PASSWORD:' env.enc.production.yaml \
    | tail -n1 | cut -c 27- | tr -d '"'\
)
echo $DISH_REGISTRY_PASSWORD | docker login $DISH_REGISTRY -u dish --password-stdin

base_name=$DISH_REGISTRY/dish/base:$DISH_BASE_VERSION
./dishctl.sh buildkit_build . $base_name

parallel --lb build ::: \
  'services/worker' \
  'services/dish-hooks' \
  'services/gorse' \
  'services/search' \
  'services/user-server' \
  'services/cron' \
  'dish-app'

docker images

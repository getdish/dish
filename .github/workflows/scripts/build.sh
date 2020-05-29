#!/usr/bin/env bash
set -e

sudo apt clean
sudo rm -rf /usr/local/lib/android
sudo rm -rf /usr/share/dotnet
df -h

build() {
  path=$1
  name=$(echo $path | cut -d / -f 2)
  docker build -t $DISH_REGISTRY/dish/$name \
    --cache-from $DISH_REGISTRY/dish/$name:ci-green \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    -f $path/Dockerfile .
}
export -f build

DISH_REGISTRY_PASSWORD=$(\
  grep 'DOCKER_REGISTRY_PASSWORD:' env.enc.production.yaml \
    | tail -n1 | cut -c 27- | tr -d '"'\
)
echo $DISH_REGISTRY_PASSWORD | docker login $DISH_REGISTRY -u dish --password-stdin

parallel --lb build ::: \
  'services/worker' \
  'services/crawlers' \
  'services/search' \
  'services/jwt-server' \
  'services/backups' \
  'apps/web'

docker images

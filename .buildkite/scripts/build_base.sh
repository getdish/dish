#!/usr/bin/env bash
set -e pipefail

PROJECT_ROOT=$(git rev-parse --show-toplevel)

cd $PROJECT_ROOT

echo "~~~ :docker: pull latest"

docker pull registry.fly.io/base:latest

echo "~~~ :docker: create dockerfile"

ls -la /data

docker_compose_file="docker-compose.buildkite-$BUILDKITE_BUILD_NUMBER-override.yml"
tag="$BUILDKITE_PIPELINE_NAME-base-$BUILDKITE_BUILD_NUMBER"

touch $docker_compose_file
cat > $docker_compose_file <<EOL
version: '3.2'
services:
  base:
    image: registry.fly.io/base:$tag
    build:
      cache_from:
        - registry.fly.io/base:latest
    volumes:
      - /data:/data
      - /data/node_modules:/app/node_modules
      - /data/dish-app/node_modules:/app/dish-app/node_modules
EOL

echo "~~~ :docker: build image"

docker-compose -f docker-compose.yml \
 -p "buildkite$BUILDKITE_COMMIT" \
 -f $docker_compose_file \
 build --pull base

echo "~~~ check out cache!!!"
ls -la /data

echo "~~~ :docker: push image"

docker-compose -f docker-compose.yml \
  -p "buildkite$BUILDKITE_COMMIT" \
  -f $docker_compose_file push base

echo "~~~ :docker: pull pre-built and tag"

docker pull registry.fly.io/base:$tag
docker tag registry.fly.io/base:$tag registry.fly.io/base

echo "~~~ :docker: push again, copied from before idk"

docker tag registry.fly.io/base registry.fly.io/base:latest
docker push registry.fly.io/base:latest


#!/usr/bin/env bash
set -e pipefail

PROJECT_ROOT=$(git rev-parse --show-toplevel)

cd $PROJECT_ROOT

echo /data
echo $HOME/data

echo "~~~ :docker: pull latest"

docker pull gcr.io/dish-258800/base:latest

echo "~~~ :docker: create dockerfile"

docker_compose_file="docker-compose.buildkite-$BUILDKITE_BUILD_NUMBER-override.yml"
tag="$BUILDKITE_PIPELINE_NAME-base-$BUILDKITE_BUILD_NUMBER"

$docker_compose_file <<EOL
version: '3.2'
services:
  base:
    image: gcr.io/dish-258800/base:$tag
    build:
      cache_from:
        - gcr.io/dish-258800/base:latest
    volumes:
      /data:/data
      /data/node_modules:/app/node_modules
      /data/dish-app/node_modules:/app/dish-app/node_modules
EOL

echo "~~~ :docker: build image"

docker-compose -f docker-compose.yml \
 -p "buildkite$BUILDKITE_COMMIT" \
 -f $docker_compose_file \
 build --pull base

echo "~~~ :docker: push image"

docker-compose -f docker-compose.yml \
  -p "buildkite$BUILDKITE_COMMIT" \
  -f $docker_compose_file push base

echo "~~~ :docker: pull pre-built and tag"

docker pull gcr.io/dish-258800/base:$tag
docker tag gcr.io/dish-258800/base:$tag gcr.io/dish-258800/base

echo "~~~ :docker: push again, copied from before idk"

docker tag gcr.io/dish-258800/base gcr.io/dish-258800/base:latest
docker push gcr.io/dish-258800/base:latest


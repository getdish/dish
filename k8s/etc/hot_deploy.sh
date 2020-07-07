#!/usr/bin/env bash

set -e

# This is just for quick deploys. Of course it skips our test suits in CI but if
# you need to get something deployed quickly then use at your own risk.

# Usage: ./hot_deploy.sh $service
# Where $service is the name of a service in the ./Riofile

# You need the `buildctl` binary installed
# Eg; `brew install buildkitd`

# You also need to be logged in to our Docker registry:
#   docker docker login docker.k8s.dishapp.com -u dish -p $password
# The password is in `env.enc.production.yaml`

echo "Hot deploying $1 service..."

pushd $(git rev-parse --show-toplevel)

DISH_REGISTRY=docker.k8s.dishapp.com
branch=$(git rev-parse --abbrev-ref HEAD)
DISH_BASE_VERSION=${branch//\//-}

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


NAME=$DISH_REGISTRY/dish/$1

buildctl \
  --addr tcp://127.0.0.1:1234 \
  build \
    --frontend=dockerfile.v0 \
    --local context=. \
    --local dockerfile=services/$1 \
    --opt build-arg:DISH_BASE_VERSION=$DISH_BASE_VERSION \
    --output type=image,name=$NAME,push=true \
    --export-cache type=inline \
    --import-cache type=registry,ref=$NAME

kubectl rollout restart deployment/$1

popd

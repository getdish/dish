#!/usr/bin/env bash

set -e

# This is just for quick deploys. Of course it skips our test suits in CI but if
# you need to get something deployed quickly then use at your own risk.

# Usage: ./hot_deploy.sh path/to/Dockerfile

# You need the `buildctl` binary installed
# Eg; `brew install buildkitd`

service_path=$1
service_name="${service_path##*/}"

echo "Hot deploying $1 service..."

pushd $(git rev-parse --show-toplevel)

DISH_REGISTRY=docker.k8s.dishapp.com
branch=$(git rev-parse --abbrev-ref HEAD)
DISH_BASE_VERSION=${branch//\//-}

if [[ $2 = 'with-base' ]]; then
  base_name=$DISH_REGISTRY/dish/base:$DISH_BASE_VERSION
  ./dishctl.sh buildkit_build . $base_name
else
  echo "Excluding base image build."
fi

NAME=$DISH_REGISTRY/dish/$service_name

./dishctl.sh buildkit_build $service_path $NAME $DISH_BASE_VERSION

kubectl rollout restart deployment/$service_name

popd

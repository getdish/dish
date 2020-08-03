#!/usr/bin/env bash

set -e

# This is just for quick deploys. Of course it skips our test suits in CI but if
# you need to get something deployed quickly then use at your own risk.

# Usage: ./hot_deploy.sh $service
# Where $service is the name of a service in the ./Riofile

# You need the `buildctl` binary installed
# Eg; `brew install buildkitd`

# You also need to be logged in to our Docker registry:
#   docker login docker.k8s.dishapp.com -u dish -p $password
# The password is in `env.enc.production.yaml`

service_path=$1
service_name="${service_path##*/}"

echo "Hot deploying $1 service..."

pushd $(git rev-parse --show-toplevel)

DISH_REGISTRY=docker.k8s.dishapp.com
branch=$(git rev-parse --abbrev-ref HEAD)
DISH_BASE_VERSION=${branch//\//-}

echo "Waiting for connection to buildkitd..."
kubectl port-forward svc/buildkitd 1234:1234 -n docker &
pid=$!
function finish {
  kill $pid
}
trap finish EXIT

while ! netstat -tna | grep 'LISTEN\>' | grep -q ':1234\>'; do
  sleep 0.1
done
echo "...connected to buildkitd."

if [[ $2 = 'with-base' ]]; then
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
else
  echo "Excluding base image build."
fi


NAME=$DISH_REGISTRY/dish/$service_name

buildctl \
  --addr tcp://127.0.0.1:1234 \
  build \
    --frontend=dockerfile.v0 \
    --local context=. \
    --local dockerfile=$service_path \
    --opt build-arg:DISH_BASE_VERSION=$DISH_BASE_VERSION \
    --output type=image,name=$NAME,push=true \
    --export-cache type=inline \
    --import-cache type=registry,ref=$NAME

kubectl rollout restart deployment/$service_name

popd

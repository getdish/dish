#!/usr/bin/env bash

# This is just for quick deploys. Of course it skips our test suits in CI but if
# you need to get something deployed quickly then use at your own risk.

# Usage: ./hot_deploy.sh $service
# Where $service is the name of a service in the ./Riofile

# You also need to be logged in to our Docker registry:
#   docker docker login docker.k8s.dishapp.com -u dish -p $password
# The password is in `env.enc.production.yaml`

echo "Hot deploying $1 service..."

pushd $(git rev-parse --show-toplevel)

NAME=docker.k8s.dishapp.com/dish/$1

docker build \
  -t $NAME \
  -f services/$1/Dockerfile .

docker push $NAME

kubectl rollout restart deployment/$1

popd

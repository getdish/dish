#!/bin/bash

set -ex

PROJECT_ROOT=$(git rev-parse --show-toplevel)
OPS_FOLDER=$PROJECT_ROOT/.ops/dish-app

mkdir -p $OPS_FOLDER
cp $PROJECT_ROOT/dish-app/fly.toml $OPS_FOLDER

pushd $PROJECT_ROOT

eval $(./dishctl.sh yaml_to_env)
export FLY_API_TOKEN=$FLY_API_TOKEN
echo "using fly token $FLY_API_TOKEN"

popd

pushd $OPS_FOLDER

# deploy
flyctl auth docker
docker tag gcr.io/dish-258800/dish-app-web:latest registry.fly.io/dish-app:latest
docker push registry.fly.io/dish-app:latest
flyctl deploy -i registry.fly.io/dish-app:latest

popd

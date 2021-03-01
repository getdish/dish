#!/bin/bash

export PROJECT_ROOT=$(git rev-parse --show-toplevel)

echo $PROJECT_ROOT

OPS_FOLDER=$PROJECT_ROOT/.ops/dish-app

mkdir -p $OPS_FOLDER

cp Dockerfile $OPS_FOLDER
cp fly.toml $OPS_FOLDER

pushd $OPS_FOLDER

# deploy
flyctl deploy

popd

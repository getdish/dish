#!/usr/bin/env bash
set -e

docker build -t dish/base .

pushd services/crawlers
docker build -t dish/crawlers .
popd

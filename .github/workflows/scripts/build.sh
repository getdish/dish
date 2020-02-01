#!/usr/bin/env bash
set -e

docker build -t dish/worker -f services/worker/Dockerfile .
docker build -t dish/crawlers -f services/crawlers/Dockerfile .

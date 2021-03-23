#!/bin/bash

docker run \
  --env-file .env \
  --env-file .env.test \
  --net host \
  registry.fly.io/dish-run-tests:latest \
  yarn test

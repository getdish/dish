#!/bin/bash

docker run \
  --env-file .env \
  --env-file .env.test \
  --net host \
  -v /var/run/docker.sock:/var/run/docker.sock \
  registry.fly.io/dish-run-tests:latest \
  yarn test

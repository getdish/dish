#!/bin/bash

# you'd have to run setup_test_services inside run_tests
  # --privileged

source .env
source .env.test

docker run \
  --net host \
  -v /var/run/docker.sock:/var/run/docker.sock \
  registry.fly.io/dish-run-tests:latest \
  yarn test

#!/bin/bash

# you'd have to run setup_test_services inside run_tests
  # --privileged

docker run \
  --env-file .env \
  --env-file .env.test \
  --net host \
  -v /var/run/docker.sock:/var/run/docker.sock \
  registry.fly.io/dish-run-tests:latest \
  yarn test

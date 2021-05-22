#!/bin/bash

if [ "$SHOULD_DEPLOY" = "1" ]; then
  docker push registry.dishapp.com/dish-base | sed -e 's/^/base: /;' &
  docker push registry.dishapp.com/dish-app | sed -e 's/^/dish-app: /;' &
  docker push registry.dishapp.com/dish-hooks | sed -e 's/^/hooks: /;' &
  docker push registry.dishapp.com/dish-site | sed -e 's/^/site: /;' &
  # docker push registry.dishapp.com/dish-run-tests | sed -e 's/^/run-tests: /;' &
  docker push registry.dishapp.com/dish-worker | sed -e 's/^/worker: /;' &
  wait
fi

#!/bin/bash

docker push registry.fly.io/dish-base | sed -e 's/^/base: /;' &
docker push registry.fly.io/dish-app | sed -e 's/^/dish-app: /;' &
docker push registry.fly.io/dish-hooks | sed -e 's/^/hooks: /;' &
docker push registry.fly.io/dish-site | sed -e 's/^/site: /;' &
docker push registry.fly.io/dish-run-tests | sed -e 's/^/run-tests: /;' &
docker push registry.fly.io/dish-worker | sed -e 's/^/worker: /;' &
docker push registry.fly.io/dish-search | sed -e 's/^/search: /;' &
docker push registry.fly.io/dish-hasura | sed -e 's/^/hasura: /;' &
docker push registry.fly.io/dish-timescale | sed -e 's/^/timescale: /;' &
docker push registry.fly.io/dish-tileserver | sed -e 's/^/tileserver: /;' &
docker push registry.fly.io/dish-tileserver | sed -e 's/^/tileserver: /;' &
docker push registry.fly.io/dish-redis | sed -e 's/^/redis: /;' &
wait

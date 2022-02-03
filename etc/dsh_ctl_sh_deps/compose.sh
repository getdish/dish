#!/bin/bash

function compose() {
  docker-compose -f docker-$1.yml $2 $3
}

function compose_build() {
  args1="--build-arg=GIT_COMMIT=$(git rev-parse --short HEAD)"
  args2="--build-arg=GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)"
  echo "--- 🐳 docker-compose build"
  set -x
  if [ "$1" = "base" ] || [ "$1" = "run-tests" ]; then
    docker-compose -f docker-internal.yml build "$args1" "$args2" "$@"
  else
    docker-compose build "$args1" "$args2" "$@"
  fi
  set +x
}

function compose_build_and_push() {
  compose_build "$@"
  echo "--- 🐳 docker push... $@"
  docker push "registry.dishapp.com/dish-$@" || echo "not our image, skip"
}

function compose_build_and_push_all() {
  compose_build_and_push base
  services=$(docker-compose config --services 2>/dev/null | tr '\r\n' ' ')
  for service in $services; do
    compose_build_and_push $service
  done
  compose_build_and_push run-tests
}

function compose_up_subset() {
  services=$1
  extra=$2
  flags=""
  if [ "$DOCKER_NO_RECREATE" != "true" ]; then
    flags="--remove-orphans --force-recreate"
  fi
  echo "compose_up_subset $flags $extra $services"
  dc="docker-compose -f $PROJECT_ROOT/docker-compose.yml"
  if [ ! -z "$DEV_USER" ]; then
    dc="$dc -f $PROJECT_ROOT/docker-compose.dev.yml"
  fi
  if [ -z "$services" ]; then
    echo "⚠️ no services specified"
  fi
  echo "$dc up $flags $extra $services"
  if [ -z "$extra" ]; then
    $dc up $flags $services
  else
    $dc up $flags $extra $services
  fi
  printf "\n\n\n"
}

function compose_up() {
  services_list="$COMPOSE_EXCLUDE${COMPOSE_EXCLUDE_EXTRA:-}"
  services=$(
    docker-compose config --services 2>/dev/null |
      grep -E -v "$services_list" |
      tr '\r\n' ' '
  )
  echo "--- 🐳 compose_up exclude $services_list services $services"
  docker_login
  # cleans up misbehaving old containers
  if [ "$DISH_ENV" = "test" ]; then
    echo "in env test cleanup old services first"
    for service in $services; do
      docker-compose rm --force "$service" > /dev/null || true
    done
  fi
  compose_up_subset "$services" "$@"
}

function build_swarmprom_images() {
  compose swarmprom build
  compose swarmprom push
}

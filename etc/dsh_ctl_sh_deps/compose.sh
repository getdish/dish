function compose() {
  docker-compose -f docker-$1.yml $2 $3
}

function compose_build() {
  args1="--build-arg=GIT_COMMIT=$(git rev-parse --short HEAD)"
  args2="--build-arg=GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)"
  echo "🐳 compose build... $args1 $args2 $@"
  if [ "$1" = "base" ] || [ "$1" = "run-tests" ]; then
    docker-compose -f docker-internal.yml build "$args1" "$args2" "$@"
  else
    docker-compose build "$args1" "$args2" "$@"
  fi
}

function compose_build_and_push() {
  compose_build "$@"
  echo "🐳 docker push... $@"
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
  echo "docker-compose up $flags $extra $services ($POSTGRES_DB $TIMESCALE_HOST $TIMESCALE_PORT_INTERNAL)"
  if [ -z "$extra" ]; then
    docker-compose up $flags $services
  else
    docker-compose up $flags "$extra" $services
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
  docker_login
  # cleans up misbehaving old containers
  if [ "$DISH_ENV" = "test" ]; then
    echo "in env test cleanup old services first"
    for service in $services; do
      docker-compose rm --force "$service" || true
    done
  fi
  compose_up_subset "$services" "$@"
}

function build_swarmprom_images() {
  compose swarmprom build
  compose swarmprom push
}

function deploy() {
  if [ "$1" = "all" ]; then
    deploy_all_to io1
  elif [ "$1" = "ci" ]; then
    deploy_ci_to io2
  else
    echo "no deploy command"
    exit 1
  fi
}

function deploy_ci_to() {
  local hostvar="$1_HOST"
  local host="${!hostvar}"
  ssh -i "$PROJECT_ROOT/etc/keys/server_rsa" -o StrictHostKeyChecking=no "root@$host" "
    cd /app
    ./dsh deploy_ci
    echo done ✅
  "
}

function deploy_all_to() {
  echo "deploying to $1"
  sync_to "$1"
  deploy_to "$1"
  printf "\n\ndeploy done ✅\n\n"
}

function deploy_to() {
  hostvar="$1_HOST"
  host="${!hostvar}"
  key="$PROJECT_ROOT/etc/keys/server_rsa"
  chmod 600 "$key"
  if [ "$host" = "" ] || [ ! -f "$key" ]; then
    echo "no host or private key $host $key"
    exit 1
  fi
  echo " 🖥  deploy (swarm)..."
  ssh -i "$key" -o StrictHostKeyChecking=no "root@$host" "
    echo start deploy
    set -e
    cd /app
    echo setup env
    source .env
    source .env.production
    ./dsh pull_all
    ./dsh deploy_all
    docker system prune --force || true &
    echo done
  "
}

function deploy_all() {
  echo "deploying all services"
  deploy_traefik
  deploy_portainer
  deploy_registry
  # let registry come online if necessary
  sleep 10 && docker_login || sleep 10 && docker_login || exit 1
  # deploy_swarmprom
  deploy_dish
}

function deploy_dish_stack_bootstrap() {
  docker stack deploy --with-registry-auth --prune -c docker-compose.yml dish
}

# shellcheck disable=SC2120
function deploy_dish() {
  echo "deploying dish - $DISH_ENV $POSTGRES_DB $POSTGRES_DB_DIR"

  updateable_services="_app|_cron|_hooks|_search|_site|_worker"
  services=$(docker stack services --format "{{.Name}}" dish | grep -E "$updateable_services")

  echo "$services" | while read -r service; do
    echo "dish restarting: $service"
    docker_restart "$service"
  done
  wait

  sleep 5
}

function deploy_one() {
  # stack service
  docker service update --force $1_$2
}

function deploy_ci() {
  compose ci build
  compose ci down || true
  compose ci rm -f || true
  compose ci up -d
}

function deploy_registry() {
  compose registry build
  compose registry push
  docker stack deploy --prune -c docker-registry.yml registry
  docker service update --force registry_registry-proxy
  docker service update --force registry_registry
}

function deploy_portainer_stack() {
  docker stack deploy --prune -c docker-portainer.yml portainer
}

function deploy_portainer() {
  # retry (out of sequence errors occasionally)
  deploy_portainer_stack || deploy_portainer_stack
  docker service update --force portainer_portainer
  docker service ps --no-trunc portainer_portainer
}

function deploy_traefik_stack() {
  docker stack deploy --prune -c docker-traefik.yml traefik
}

function deploy_traefik() {
  docker network create --driver=overlay traefik-public &>/dev/null || true
  # retry (out of sequence errors occasionally)
  deploy_traefik_stack || deploy_traefik_stack
  docker service update --force traefik_traefik
  docker service ps --no-trunc traefik_traefik
}

function deploy_internal() {
  docker-compose -f docker-internal.yml build ci
  docker-compose -f docker-internal.yml up -d ci
}

function deploy_swarmprom() {
  # ensure images needed next in registry
  build_swarmprom_images
  docker stack deploy --prune -c docker-swarmprom.yml swarmprom
}

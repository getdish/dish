function setup_server() {
  host=$1
  echo "setting up $host"
  setup_server_ssh "$host"
  setup_server_docker "$host"
  setup_server_pre_sync "$host"
  sync_to "$host"
  setup_server_services "$host"
}

function setup_ci_server() {
  # resize /var partition first!
  # pvs
  # resize2fs /dev/mapper/vg00-var
  # lvextend -L +900G /dev/mapper/vg00-var
  local host=$1
  echo "setting up $host"
  setup_server_ssh "$host"
  setup_server_docker "$host"
  setup_server_pre_sync "$host"
  sync_to "$host"
  hostvar="$1_HOST"
  host="${!hostvar}"
  key="$PROJECT_ROOT/etc/keys/server_rsa"
  ssh -i "$key" -o StrictHostKeyChecking=no "root@$host" "
    echo setup post
    set -e
    unattended-upgrade -d
    cd /app
    ./dsh setup_docker_daemon_conf
    ./dsh setup_domain_certs
    echo restarting docker
    service docker restart
    cd /app
    ./dsh setup_compose
    ./dsh setup_buildkite
    ./dsh docker_login || true
    ./dsh deploy_ci
    echo done ✅
  "
}

function setup_server_ssh() {
  local hostvar="$1_HOST"
  local host="${!hostvar}"
  ssh-copy-id -i etc/keys/server_rsa "root@$host"
}

function setup_server_docker() {
  local hostvar="$1_HOST"
  local host="${!hostvar}"
  echo "$1 $host via $hostvar"
  docker-machine create --driver generic --generic-ip-address "$host" \
    --generic-ssh-user root --generic-ssh-key etc/keys/server_rsa "$1" \
    || echo "already exists? continue"
}

function setup_server_pre_sync() {
  local hostvar="$1_HOST"
  local host="${!hostvar}"
  key="$PROJECT_ROOT/etc/keys/server_rsa"
  ssh -i "$key" -o StrictHostKeyChecking=no "root@$host" "
    echo setup pre
    set -e
    apt update
    apt install -y fail2ban
    mkdir -p /app
    mkdir -p /var/data/buildkite
    mkdir -p /var/data/buildkite-docker
    mkdir -p /var/data/docker
    mkdir -p /var/data/gorse
    mkdir -p /var/data/traefik
    mkdir -p /var/data/portainer
    mkdir -p /var/data/registry
    mkdir -p /var/data/registry-mirror
    mkdir -p /var/data/postgresdb/production
    mkdir -p /var/data/postgresdb/test
    mkdir -p /var/data/timescaledb/production
    mkdir -p /var/data/timescaledb/test
    echo 'alias dsh=/app/dsh' >> ~/.bashrc
    echo 'source /app/.env' >> ~/.bashrc
    echo 'source /app/.env.production' >> ~/.bashrc
  "
}

function setup_server_services() {
  local hostvar="$1_HOST"
  local host="${!hostvar}"
  key="$PROJECT_ROOT/etc/keys/server_rsa"
  ssh -i "$key" -o StrictHostKeyChecking=no "root@$host" "
    echo setup post
    set -e
    ./dsh setup_docker_daemon_conf
    ./dsh setup_domain_certs
    echo restarting docker
    service docker restart
    cd /app
    ./dsh setup_compose
    ./dsh setup_swarm $1
    ./dsh docker_login
    # pre push images to registry
    ./dsh compose_build_and_push_all
    echo done
  "
}

function setup_docker_daemon_conf() {
  echo "linking in daemon conf"
  ln -s /app/etc/docker/daemon.json /etc/docker/daemon.json || echo exists, ok
}

function setup_domain_certs() {
  echo "copying certs"
  mkdir -p /var/data/traefik
  mv /var/data/traefik/acme-production.json /var/data/traefik/acme-production-bak.json || true
  cp ./etc/domain-certificates.json /var/data/traefik/acme-production.json
  chmod 600 /var/data/traefik/acme-production.json
}

# from a cold boot this should set up everything
function setup_swarm() {
  local hostvar="$1_HOST"
  local host="${!hostvar}"
  if [ "$host" = "" ]; then
    echo "no host given"
    exit 1
  fi
  docker swarm init --advertise-addr "$host"
  docker network create --driver=overlay traefik-public
  NODE_ID=$(docker info -f '{{.Swarm.NodeID}}')
  docker node update --label-add portainer.portainer-data=true "$NODE_ID"
  docker node update --label-add traefik-public.traefik-public-certificates=true "$NODE_ID"
  # for adding workers/managers
  # docker swarm join --token $(docker swarm join-token manager -q) "$d1_HOST:2377"
  # docker swarm join --token $(docker swarm join-token worker -q) "$d1_HOST:2377"
}

function setup_buildkite() {
  if ! [ -x $(command -v buildkite-agent) ]; then
    echo "deb https://apt.buildkite.com/buildkite-agent stable main" | sudo tee /etc/apt/sources.list.d/buildkite-agent.list
    sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 32A37959C2FA5C3C99EFBC32A79206696452D198
    apt-get update && sudo apt-get install -y buildkite-agent
  fi
}

function setup_compose() {
  if ! [ -x "$(command -v docker-compose)" ]; then
    curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
  fi
}

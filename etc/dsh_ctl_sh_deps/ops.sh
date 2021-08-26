function shell() {
  hostvar="$1_HOST"
  host="${!hostvar}"
  ssh-add etc/keys/server_rsa
  ssh "root@$host"
}

function exec() {
  app=${1:-app}
  shift
  cmd=$*
  echo "exec $app: running $cmd"
  docker exec -it $(docker ps | grep $app | head -n1 | awk '{print $1}') $cmd
}


function logs() {
  docker service logs "$@"
}

function docker_swarm_logs() {
  journalctl -u docker.service | tail -n 50
  docker events
}

function docker_prune() {
  docker system prune -f
}

function destroy_all() {
  docker stack rm traefik || true
  docker stack rm portainer || true
  docker stack rm registry || true
  docker stack rm swarmpron || true
  docker stack rm dish || true
  docker system prune -f
}

function pull_all() {
  docker-compose pull
  docker-compose -f docker-internal.yml pull &
  docker-compose -f docker-swarmprom.yml pull &
  docker-compose -f docker-traefik.yml pull &
  docker-compose -f docker-registry.yml pull &
  docker-compose -f docker-portainer.yml pull &
  wait
}

function docker_restart() {
  docker service update --force "$1"
}

function log_ci() {
  docker logs app_ci_1 "$@"
}

function log_traefik() {
  docker service logs traefik_traefik "$@"
}

function log_app() {
  docker service logs dish_app "$@"
}

function log_services() {
  docker node ps
}

function log_service() {
  docker service logs -f "$1_$2"
}

function restart_ci() {
  # buildkite after a plain restart loses network, this fixes it
  docker-compose -f docker-internal.yml stop ci
  docker-compose -f docker-internal.yml rm -f ci
  docker-compose -f docker-internal.yml up -d ci
}

function nodes() {
  docker node ls
  docker node ps
}

function services() {
  docker service ls
  docker node ps
}

function log_command {
  echo "$" "$@"
  eval $(printf '%q ' "$@") </dev/tty
}

function ci_shell() {
  docker exec -it app_ci_1 bash
}

# TODO make this automatic
function postgres_resetwal() {
  sudo -u systemd-coredump /usr/lib/postgresql/12/bin/pg_resetwal -f /var/data/postgresdb/production || echo "didnt reset"
}

function bull_delete_queue() {
  queue=$1
  redis_command "EVAL \"\
    local keys = redis.call('keys', ARGV[1]) \
    for i=1,#keys,5000 do \
      redis.call('del', unpack(keys, i, math.min(i+4999, #keys))) \
    end \
    return keys \
  \" 0 bull:$queue*"
}

function docker_registry_gc() {
  rm -r /var/data/registry-mirror/docker/registry/v2/repositories/dish-*
  docker image prune --all --filter "until=2h" --force || true
  docker system prune --filter "until=2h" --force || true
  docker volume rm $(docker volume ls -qf dangling=true)
  docker system prune
  clean_dangling
  for id in $(docker ps -aqf "name=registry-proxy" | xargs); do
    docker exec -it "$id" \
      bin/registry garbage-collect --delete-untagged /etc/docker/registry/config.yml
  done
}

function clean_docker_if_disk_full() {
  echo "checking if disk near full..."
  df -H | grep /dev/md2 | head -n 1 | awk '{ print $5 " " $1 }' | while read output; do
    used=$(echo "$output" | awk '{ print $1}' | cut -d'%' -f1)
    echo "$output used $used"
    if [ "$used" -ge 90 ]; then
      echo "running out of space, pruning..."
      docker image prune --all --filter "until=2h" --force || true
      docker system prune --filter "until=2h" --force || true
      docker volume rm $(docker volume ls -qf dangling=true)
      break
    fi
  done
  df -H | grep /dev/md2 | awk '{ print $5 " " $1 }' | while read output; do
    used=$(echo "$output" | awk '{ print $1}' | cut -d'%' -f1)
    if [ "$used" -ge 90 ]; then
      echo "really full, delete all.."
      docker system prune
      docker image prune --all
      break
    fi
  done
}

# https://gist.github.com/mortensteenrasmussen/512f0566dbc3ef1cc4a2c47dd9cdb973
# function clean_registry() {
#   REGISTRY_DIR=YOUR_REGISTRY_DIR/data/docker/registry/v2/repositories
#   REGISTRY_URL=http://10.10.10.10:5000
#   #add --insecure to the curl command on line 17 if you use https with self-signed certificates

#   cd ${REGISTRY_DIR}
#   count=0

#   manifests_without_tags=$(comm -23 <(find . -type f -name "link" | grep "_manifests/revisions/sha256" | grep -v "\/signatures\/sha256\/" | awk -F/ '{print $(NF-1)}' | sort) <(for f in $(find . -type f -name "link" | grep "_manifests/tags/.*/current/link"); do cat ${f} | sed 's/^sha256://g'; echo; done | sort))

#   total_count=$(echo ${manifests_without_tags} | wc -w)

#   for manifest in ${manifests_without_tags}; do
#     repo=$(find . | grep "_manifests/revisions/sha256/${manifest}/link" | awk -F "_manifest"  '{print $(NF-1)}' | sed 's#^./\(.*\)/#\1#')

#     #should have error checking on the curl command, it might fail silently atm.
#     curl -s -X DELETE ${REGISTRY_URL}/v2/${repo}/manifests/sha256:${manifest} > /dev/null

#     ((count++))
#     echo "Deleted ${count} of ${total_count} manifests."
#   done
# }

function gorse_status() {
  _run_on_cluster alpine && return 0
  apk add --no-cache curl
  curl http://gorse:9000/status
}

function ping_home_page() {
  curl 'https://search.dishapp.com/top_cuisines?lon=-122.421351&lat=37.759251&distance=0.16'
}

function clean_dangling() {
  # remove dangling images which can mess up pull/push
  docker rmi $(docker images --filter "dangling=true" -q --no-trunc) || true
}

function hungry_services_tunnels() {
  echo "Opening tunnels to hungry services on prod..."
  hungry_service_tunnel 5005 &
  hungry_service_tunnel 8884 &
  wait
}

# This are big, relatively unchanging services, such as bert, image-quality, that don't need to be
# brought up and down in every CI run
function hungry_service_tunnel() {
  port=$1
  ssh -N -i etc/keys/server_rsa -L $port:localhost:$port root@$io1_HOST
}

function worker_cli() {
  worker=$(docker ps -qf "name=dish_worker" | head -n1)
  docker exec -it $worker "$@"
}

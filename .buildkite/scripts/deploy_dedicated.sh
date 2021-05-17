#!/usr/bin/env bash
set -e pipefail

export DISH_ENV=production
PROJECT_ROOT=$(git rev-parse --show-toplevel)
cd "$PROJECT_ROOT"

PRIVATE_KEY="$PROJECT_ROOT/etc/keys/d1_reliablesite_dish"
source .env.d1
SERVICES=$(
  docker-compose config --services 2> /dev/null \
    | grep -E -v "$COMPOSE_EXCLUDE" \
    | tr '\r\n' ' '
)

echo "🖥 deploying dedicated server: $SERVICES..."

echo "rsync..."

rsync \
  -avP \
  --filter=':- .gitignore' \
  --filter='- .git' \
  -e "ssh -o StrictHostKeyChecking=no -i $PRIVATE_KEY" \
  . "root@$DEDICATED_SERVER_HOST:/app" &> /dev/nul

echo "ssh..."

ssh \
  -i "$PRIVATE_KEY" \
  -o StrictHostKeyChecking=no \
  "root@$DEDICATED_SERVER_HOST" "
    set -e
    cd /app
    set -a
    source .env
    source .env.production
    source .env.d1
    flyctl auth docker
    ./dishctl.sh umami_migrate
    docker-compose build postgres nginx-proxy
    docker-compose pull $SERVICES
    docker-compose stop -t 3 $SERVICES || true
    docker-compose rm -f $SERVICES || true
    docker-compose --env-file .env.production up -d $SERVICES
    ./dishctl.sh wait_until_services_ready
    ./dishctl.sh hasura_migrate
    ./dishctl.sh timescale_migrate
    echo done
    docker system prune --force
  "

printf "\n\n 🖥 deploying dedicated server done ✅ \n\n"


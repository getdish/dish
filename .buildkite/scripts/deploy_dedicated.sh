#!/usr/bin/env bash
set -e pipefail

export DISH_ENV=production

PROJECT_ROOT=$(git rev-parse --show-toplevel)
PRIVATE_KEY="$PROJECT_ROOT/etc/keys/d1_reliablesite_dish"

cd "$PROJECT_ROOT"
source .env.d1
SERVICES=$(
  docker-compose config --services 2> /dev/null \
    | grep -E -v "$COMPOSE_EXCLUDE" \
    | tr '\r\n' ' '
)

echo "🖥 deploying dedicated server: $SERVICES..."

echo "rsync..."

rsync \
  -avP --delete --filter=':- .gitignore' --filter='- .git' \
  -e "ssh -o StrictHostKeyChecking=no -i $PRIVATE_KEY" \
  . "root@$DEDICATED_SERVER_HOST:/app" &> /dev/null

echo "ssh..."

ssh \
  -i "$PRIVATE_KEY" \
  -o StrictHostKeyChecking=no \
  "root@$DEDICATED_SERVER_HOST" "
    set -e
    cd /app
    source .env
    source .env.production
    source .env.d1
    yarn
    flyctl auth docker
    # docker-compose build postgres nginx-proxy
    # docker-compose pull $SERVICES
    # docker-compose stop -t 3 $SERVICES || true
    # docker-compose rm -f $SERVICES || true
    # docker-compose up -d $SERVICES
    # ./dsh wait_until_services_ready
    dsh deploy
    echo todo migrate on start
    sleep 10
    dsh hasura_migrate
    dsh timescale_migrate
    dsh umami_migrate
    docker system prune --force
    echo done
  "

printf "\n\n 🖥 deploying dedicated server done ✅ \n\n"


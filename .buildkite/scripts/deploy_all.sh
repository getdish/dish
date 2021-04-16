#!/usr/bin/env bash
set -e pipefail

echo "Deploying apps..."

PROJECT_ROOT=$(git rev-parse --show-toplevel)
cd "$PROJECT_ROOT"

# deploy dedicated
function deploy_dedicated_server() {
  PRIVATE_KEY="$PROJECT_ROOT/etc/keys/d1_reliablesite_dish"
  DEDICATED_APPS="hasura postgres"
  DISH_IMAGE_TAG=":latest"
  IMAGE="$DISH_REGISTRY/%$DISH_IMAGE_TAG"
  rsync \
    -avP \
    --filter=':- .gitignore' \
    -e "ssh -o StrictHostKeyChecking=no -i $PRIVATE_KEY" \
    . "root@$DEDICATED_SERVER_HOST:/app" > /dev/null
  ssh \
    -i "$PRIVATE_KEY" \
    -o StrictHostKeyChecking=no \
    "root@$DEDICATED_SERVER_HOST" "
      set -e
      docker system prune --force
      cd /app
      git checkout nate/dev
      ./dishctl.sh dish_registry_auth
      set -a
      source .env
      source .env.production
      set +a
      parallel -j 6 --tag --lb -I% docker pull $IMAGE ::: 'dish-hasura' 'dish-hooks'
      docker-compose build postgres
      docker-compose stop $DEDICATED_APPS || true
      docker-compose rm -f $DEDICATED_APPS || true
      docker-compose up -d $DEDICATED_APPS
    "
  echo "success"
}

deploy_dedicated_server

# deploy fly
./dishctl.sh deploy_all

# post to slack
commit=$(git rev-parse HEAD)
# link="https://github.com/getdish/dish/tree/$commit"
message="
Successful deploy of $commit \n
Code: https://github.com/getdish/dish/tree/$commit \n
CI Run: $BUILDKITE_BUILD_URL
"
./dishctl.sh send_slack_monitoring_message "$message"

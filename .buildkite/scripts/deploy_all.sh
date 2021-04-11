#!/usr/bin/env bash
set -e pipefail

echo "Deploying apps..."

PROJECT_ROOT=$(git rev-parse --show-toplevel)
cd "$PROJECT_ROOT"

# deploy dedicated
# function deploy_dedicated_server() {
#   PRIVATE_KEY="$PROJECT_ROOT/etc/keys/d1_reliablesite_dish"
#   DEDICATED_APPS="ci"
#   DISH_IMAGE_TAG=":latest"
#   rsync \
#     -avP \
#     --filter=':- .gitignore' \
#     -e "ssh -o StrictHostKeyChecking=no -i $PRIVATE_KEY" \
#     . "root@$DEDICATED_SERVER_HOST:/app"
#   ssh \
#     -i "$PRIVATE_KEY" \
#     -o StrictHostKeyChecking=no \
#     "root@$DEDICATED_SERVER_HOST" "
#       set -e
#       docker system prune --force
#       cd /app
#       git checkout nate/dev
#       source .env
#       source .env.production
#       docker-compose stop $DEDICATED_APPS || true
#       docker-compose rm -f $DEDICATED_APPS || true
#       ./dishctl.sh docker_pull_images_that_compose_would_rather_build || true
#       DISH_IMAGE_TAG=$DISH_IMAGE_TAG docker-compose up -d $DEDICATED_APPS
#     "
#   echo "success"
# }

# deploy_dedicated_server

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

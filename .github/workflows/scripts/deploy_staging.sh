#!/usr/bin/env bash
set -e
set -x

echo "Deploying staging branch to staging droplet..."

./dishctl.sh ci_push_images_to "staging"

PROJECT_ROOT=$(git rev-parse --show-toplevel)
chmod 600 $PROJECT_ROOT/k8s/etc/ssh/dish-staging.priv

cd $PROJECT_ROOT
rsync \
  -avP \
  --filter=':- .gitignore' \
  -e "ssh -o StrictHostKeyChecking=no -i $PROJECT_ROOT/k8s/etc/ssh/dish-staging.priv" \
  . root@ssh.staging.dishapp.com:/app

ssh \
  -i $PROJECT_ROOT/k8s/etc/ssh/dish-staging.priv \
  -o StrictHostKeyChecking=no \
  root@ssh.staging.dishapp.com '

set -e

docker system prune --force

cd /app
git checkout staging

# migrate
USE_PROD_HASURA_PASSWORD=true ./dishctl.sh db_migrate_local

# restart
docker-compose stop dish-app-web dish-hooks search tileserver worker
docker-compose rm -f dish-app-web dish-hooks search worker || true
./dishctl.sh docker_pull_images_that_compose_would_rather_build
eval $(./dishctl.sh yaml_to_env) DISH_IMAGE_TAG=":staging" \
  docker-compose up -d dish-app-web dish-hooks search tileserver worker
'

commit=$(git rev-parse HEAD)
link="https://github.com/getdish/dish/tree/$commit"
message="
Successful deploy of $commit to staging droplet \n
Code: https://github.com/getdish/dish/tree/$commit \n
CI Run: https://github.com/getdish/dish/actions/runs/$GITHUB_RUN_ID?check_suite_focus=true
"

./dishctl.sh send_slack_monitoring_message "$message"

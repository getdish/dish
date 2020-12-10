#!/usr/bin/env bash
set -e

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
export DISH_IMAGE_TAG=staging

cd /app
git checkout staging
./dishctl.sh db_migrate_local
docker-compose pull
docker-compose restart dish-app-web user-server dish-hooks search
'

commit=$(git rev-parse HEAD)
link="https://github.com/getdish/dish/tree/$commit"
message="
Successful deploy of $commit to staging droplet \n
Code: https://github.com/getdish/dish/tree/$commit \n
CI Run: https://github.com/getdish/dish/actions/runs/$GITHUB_RUN_ID?check_suite_focus=true
"

./dishctl.sh send_slack_monitoring_message "$message"

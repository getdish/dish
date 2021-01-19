#!/usr/bin/env bash
set -e
set -x

echo "Deploying production branch to production..."

./dishctl.sh install_doctl
./dishctl.sh init_doctl
./dishctl.sh db_migrate
./dishctl.sh ci_push_images_to "production"
./dishctl.sh rollout_all_services

commit=$(git rev-parse HEAD)
link="https://github.com/getdish/dish/tree/$commit"
message="
Successful deploy of $commit to production Kubernetes \n
Code: https://github.com/getdish/dish/tree/$commit \n
CI Run: https://github.com/getdish/dish/actions/runs/$GITHUB_RUN_ID?check_suite_focus=true
"

./dishctl.sh send_slack_monitoring_message "$message"

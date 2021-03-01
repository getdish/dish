#!/usr/bin/env bash
set -ex pipefail

echo "Deploying apps..."

PROJECT_ROOT=$(git rev-parse --show-toplevel)

curl -L https://fly.io/install.sh | sh
export FLYCTL_INSTALL="$HOME/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

./dish-app/deploy.sh

commit=$(git rev-parse HEAD)
link="https://github.com/getdish/dish/tree/$commit"
message="
Successful deploy of $commit to staging droplet \n
Code: https://github.com/getdish/dish/tree/$commit \n
CI Run: https://github.com/getdish/dish/actions/runs/$GITHUB_RUN_ID?check_suite_focus=true
"

./dishctl.sh send_slack_monitoring_message "$message"

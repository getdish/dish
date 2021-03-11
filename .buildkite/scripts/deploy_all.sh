#!/usr/bin/env bash
set -e pipefail

echo "Deploying apps..."

PROJECT_ROOT=$(git rev-parse --show-toplevel)
cd "$PROJECT_ROOT"

# deploy
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

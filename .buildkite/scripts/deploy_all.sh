#!/usr/bin/env bash
set -e pipefail

echo "Deploying apps..."

PROJECT_ROOT=$(git rev-parse --show-toplevel)

# fly
if ($(which flyctl > /dev/null)); then
  echo "flyctl installed"
else
  curl -L https://fly.io/install.sh | bash
fi
export FLYCTL_INSTALL="$HOME/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"
eval $(./dishctl.sh yaml_to_env)
export FLY_API_TOKEN=$FLY_API_TOKEN

# deploy
echo "deploying..."
./dishctl.sh deploy_fly_app dish-app dish-app dish-app-web &
./dishctl.sh deploy_fly_app dish-hasura services/hasura hasura  &
./dishctl.sh deploy_fly_app dish-search services/search search  &
./dishctl.sh deploy_fly_app dish-timescale services/timescaledb timescaledb  &
./dishctl.sh deploy_fly_app dish-tileserver services/tileserver tileserver  &
./dishctl.sh deploy_fly_app dish-hooks services/dish-hooks dish-hooks  &
./dishctl.sh deploy_fly_app dish-worker services/worker worker  &
wait -n

# post to slack
commit=$(git rev-parse HEAD)
link="https://github.com/getdish/dish/tree/$commit"
message="
Successful deploy of $commit to staging droplet \n
Code: https://github.com/getdish/dish/tree/$commit \n
CI Run: $BUILDKITE_BUILD_URL
"
./dishctl.sh send_slack_monitoring_message "$message"

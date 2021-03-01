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

echo "setup env..."

# env
eval $(./dishctl.sh yaml_to_env)
export PG_USERNAME=$FLY_PG_USERNAME
export PG_PASSWORD=$FLY_PG_PASSWORD
export PG_HOSTNAME=$FLY_PG_HOSTNAME
export PG_PROXY_PORT=$FLY_PG_PROXY_PORT
export PG_PORT=$FLY_PG_PORT

# TODO move into services/hasura/hooks/pre-deploy.sh
# hasura
export HASURA_GRAPHQL_NO_OF_RETRIES=20
export HASURA_GRAPHQL_DATABASE_URL=$HASURA_FLY_POSTGRES_URL
export HASURA_GRAPHQL_ENABLED_LOG_TYPES="startup, http-log, webhook-log, websocket-log, query-log"
export HASURA_GRAPHQL_ENABLE_TELEMETRY=false
export HASURA_GRAPHQL_ADMIN_SECRET=${TF_VAR_HASURA_GRAPHQL_ADMIN_SECRET:-password}
export HASURA_GRAPHQL_UNAUTHORIZED_ROLE="anon"
export HASURA_GRAPHQL_JWT_SECRET='{"type":"HS256", "key":"12345678901234567890123456789012"}'
export HASURA_GRAPHQL_ENABLE_CONSOLE=true
export DISH_HOOKS_ENDPOINT="http://dish-hooks:6154"
export GORSE_SYNC_HOOK="http://dish-hooks:6154/gorse_sync"
export VIRTUAL_HOST="hasura.fly.dev"
pushd services/hasura
 flyctl secrets set \
    HASURA_GRAPHQL_NO_OF_RETRIES="$HASURA_GRAPHQL_NO_OF_RETRIES" \
    HASURA_GRAPHQL_DATABASE_URL="$HASURA_GRAPHQL_DATABASE_URL" \
    HASURA_GRAPHQL_ENABLED_LOG_TYPES="$HASURA_GRAPHQL_ENABLED_LOG_TYPES" \
    HASURA_GRAPHQL_ENABLE_TELEMETRY="$HASURA_GRAPHQL_ENABLE_TELEMETRY" \
    HASURA_GRAPHQL_ADMIN_SECRET="$HASURA_GRAPHQL_ADMIN_SECRET" \
    HASURA_GRAPHQL_UNAUTHORIZED_ROLE="$HASURA_GRAPHQL_UNAUTHORIZED_ROLE" \
    HASURA_GRAPHQL_JWT_SECRET="$HASURA_GRAPHQL_JWT_SECRET" \
    HASURA_GRAPHQL_ENABLE_CONSOLE="$HASURA_GRAPHQL_ENABLE_CONSOLE" \
    DISH_HOOKS_ENDPOINT="$DISH_HOOKS_ENDPOINT" \
    GORSE_SYNC_HOOK="$GORSE_SYNC_HOOK" \
    VIRTUAL_HOST="$VIRTUAL_HOST" || true
popd

echo "deploying..."
echo $HASURA_GRAPHQL_DATABASE_URL

# deploy
# ./dishctl.sh deploy_fly_app dish-app dish-app dish-app-web &
./dishctl.sh deploy_fly_app dish-hasura services/hasura hasura  &
wait -n

# post to slack
commit=$(git rev-parse HEAD)
link="https://github.com/getdish/dish/tree/$commit"
message="
Successful deploy of $commit to staging droplet \n
Code: https://github.com/getdish/dish/tree/$commit \n
CI Run: https://github.com/getdish/dish/actions/runs/$GITHUB_RUN_ID?check_suite_focus=true
"
./dishctl.sh send_slack_monitoring_message "$message"

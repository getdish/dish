#!/usr/bin/env bash
set -e

PATH=$PATH:$HOME/bin
RIO_VERSION='0.7.0'
RIO_BINARY=https://github.com/rancher/rio/releases/download/v$RIO_VERSION/rio-linux-amd64
RIO_PATH=$HOME/bin/rio

DOCTL_VERSION='1.42.0'
DOCTL_BINARY=https://github.com/digitalocean/doctl/releases/download/v$DOCTL_VERSION/doctl-$DOCTL_VERSION-linux-amd64.tar.gz
DOCTL_PATH=$HOME/bin/

echo "Installing \`rio\` binary v$RIO_VERSION..."
mkdir -p $HOME/bin
curl -sL $RIO_BINARY > $RIO_PATH
chmod 755 $RIO_PATH
rio --version

echo "Installing \`doctl\` binary v$DOCTL_VERSION..."
curl -sL $DOCTL_BINARY | tar -xzv -C $DOCTL_PATH
doctl version

echo "Deploying production branch to production..."
HASURA_ADMIN=$(\
  grep 'HASURA_GRAPHQL_ADMIN_SECRET:' env.enc.production.yaml \
    | tail -n1 | cut -c 30- | tr -d '"'\
)
pushd services/hasura
curl -L https://github.com/hasura/graphql-engine/raw/master/cli/get.sh | bash
hasura migrate apply --endpoint https://hasura.rio.dishapp.com --admin-secret "$HASURA_ADMIN"
popd

./k8s/etc/docker_registry_gc.sh

echo "Pushing new docker images to production registry..."
DISH_REGISTRY_PASSWORD=$(\
  grep 'DOCKER_REGISTRY_PASSWORD:' env.enc.production.yaml \
  | tail -n1 | cut -c 27- | tr -d '"'\
)
docker login $DISH_REGISTRY -u dish -p $DISH_REGISTRY_PASSWORD
declare -a images=(
  "web"
  "worker"
  "crawlers"
  "jwt-server"
  "search"
  "backups"
)
for image in "${images[@]}"
do
  docker push $DISH_REGISTRY/dish/$image
done

DO_KEY=$(\
  grep 'TF_VAR_DO_DISH_KEY:' env.enc.production.yaml \
    | tail -n1 | cut -c 21- | tr -d '"'\
)
doctl auth init -t $DO_KEY
doctl kubernetes cluster kubeconfig save dish
rio up --answers env.enc.production.yaml
kubectl rollout \
  restart deployment \
  $(kubectl get deployments | tail -n +2 | cut -d ' ' -f 1)
rio ps

HOOK=$(\
  grep 'SLACK_MONITORING_HOOK:' env.enc.production.yaml \
  | tail -n1 | cut -c 24- | tr -d '"'\
)
commit=$(git rev-parse HEAD)
link="https://github.com/getdish/dish/tree/$commit"
message="
Successful Deploy of $commit to production Kubernetes \n
Code: https://github.com/getdish/dish/tree/$commit \n
CI Run: https://github.com/getdish/dish/actions/runs/$GITHUB_RUN_ID?check_suite_focus=true
"
curl -X POST $HOOK \
  -H 'Content-type: application/json' \
  --data @- <<EOF
  {
    "text": "$message",
  }
EOF

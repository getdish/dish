#!/usr/bin/env bash
set -e

PATH=$PATH:$HOME/bin
KEY_PATH=$HOME/gitcrypt-key
RIO_VERSION='0.7.0'
RIO_BINARY=https://github.com/rancher/rio/releases/download/v$RIO_VERSION/rio-linux-amd64
RIO_PATH=$HOME/bin/rio

echo "Installing Rio v$RIO_VERSION..."
mkdir -p $HOME/bin
curl -sL $RIO_BINARY > $RIO_PATH
chmod 755 $RIO_PATH
rio --version

echo "Decrypting Dish secrets..."
sudo apt-get install -y git-crypt
echo $GITCRYPT_KEY > $KEY_PATH.base64
cat $KEY_PATH.base64 | base64 -d > $KEY_PATH
git-crypt unlock $KEY_PATH

echo "Deploying production branch to production..."
HASURA_ADMIN=$(\
  grep 'HASURA_GRAPHQL_ADMIN_SECRET:' env.enc.production.yaml \
    | tail -n1 | cut -c 30- | tr -d '"'\
)
pushd services/hasura
hasura migrate apply --endpoint https://hasura.rio.dishapp.com --admin-secret "$HASURA_ADMIN"
popd
mkdir -p $HOME/.kube
cp -a k8s/etc/k8s_admin_creds.enc.config $HOME/.kube/config
rio up --answers env.enc.production.yaml

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

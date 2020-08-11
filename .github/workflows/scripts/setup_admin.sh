#!/usr/bin/env bash
set -e

PATH=$PATH:$HOME/bin
mkdir -p $HOME/bin

DOCTL_VERSION='1.42.0'
DOCTL_BINARY=https://github.com/digitalocean/doctl/releases/download/v$DOCTL_VERSION/doctl-$DOCTL_VERSION-linux-amd64.tar.gz
DOCTL_PATH=$HOME/bin/

BUILDKIT_VERSION='0.7.1'
BK_TAR=https://github.com/moby/buildkit/releases/download/v$BUILDKIT_VERSION/buildkit-v$BUILDKIT_VERSION.linux-amd64.tar.gz
BKCTL_PATH=$HOME/bin/

echo "Installing \`doctl\` binary v$DOCTL_VERSION..."
curl -sL $DOCTL_BINARY | tar -xzv -C $DOCTL_PATH
doctl version

echo "Installing \`buildctl\` binary v$BUILDKIT_VERSION..."
curl -sL $BK_TAR | tar -xzf - bin/buildctl
mv bin/buildctl $BKCTL_PATH
buildctl --version

DO_KEY=$(\
  grep 'TF_VAR_DO_DISH_KEY:' env.enc.production.yaml \
    | tail -n1 | cut -c 21- | tr -d '"'\
)
doctl auth init -t $DO_KEY
doctl kubernetes cluster kubeconfig save $CURRENT_DISH_CLUSTER

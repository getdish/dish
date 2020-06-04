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

DO_KEY=$(\
  grep 'TF_VAR_DO_DISH_KEY:' env.enc.production.yaml \
    | tail -n1 | cut -c 21- | tr -d '"'\
)
doctl auth init -t $DO_KEY
doctl kubernetes cluster kubeconfig save dish

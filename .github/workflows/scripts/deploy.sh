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
mkdir -p $HOME/.kube
cp -a k8s/etc/k8s_admin_creds.enc.config $HOME/.kube/config
rio up --answers env.enc.production.yaml

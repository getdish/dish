#!/usr/bin/env bash
set -e
set -x

PATH=$PATH:$HOME/bin
mkdir -p $HOME/bin

export PATH=$PATH:"$HOME/bin/google-cloud-sdk/bin"

./dishctl.sh install_gcloud_sdk

echo $PATH
cat ~/.docker/config.json

yes | gcloud components install docker-credential-gcr

which gcloud
ls -la /root/bin/google-cloud-sdk/bin

which docker-credential-gcloud

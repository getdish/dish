#!/usr/bin/env bash
set -e
set -x

echo "$HOME/bin" >> $GITHUB_PATH
echo "$(yarn global bin)/" >> $GITHUB_PATH
echo "$HOME/bin/google-cloud-sdk/bin" >> $GITHUB_PATH

PATH=$PATH:$HOME/bin
mkdir -p $HOME/bin

./dishctl.sh install_gcloud_sdk


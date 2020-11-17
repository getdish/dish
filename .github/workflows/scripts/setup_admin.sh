#!/usr/bin/env bash
set -e

echo "$HOME/bin" >> $GITHUB_PATH
echo "$(yarn global bin)/" >> $GITHUB_PATH

PATH=$PATH:$HOME/bin
mkdir -p $HOME/bin

./dishctl.sh install_doctl
./dishctl.sh init_doctl

BUILDKIT_VERSION='0.7.1'
BK_TAR=https://github.com/moby/buildkit/releases/download/v$BUILDKIT_VERSION/buildkit-v$BUILDKIT_VERSION.linux-amd64.tar.gz
BKCTL_PATH=$HOME/bin/

echo "Installing \`buildctl\` binary v$BUILDKIT_VERSION..."
curl -sL $BK_TAR | tar -xzf - bin/buildctl
mv bin/buildctl $BKCTL_PATH
buildctl --version


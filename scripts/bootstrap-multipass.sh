#!/bin/bash

set -e

brew cask install multipass
multipass launch --name k3s --mem 6G --disk 150G
multipass ssh

# setup k3s
curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644

# setup rio
curl -sfL https://get.rio.io | sh -
rio install

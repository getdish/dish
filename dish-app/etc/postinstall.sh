#!/bin/bash

set -eo pipefail

yarn patch-package
DEBUG=workspaces expo-yarn-workspaces postinstall &> /dev/null

if [ -n "$EAS_BUILD" ]; then
  echo $NETRC | base64 -d > ~/.netrc
  echo "copied netrc"
fi

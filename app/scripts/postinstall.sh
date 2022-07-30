#!/bin/bash

set -eo pipefail

yarn patch-package || true

if [ -n "$EAS_BUILD" ]; then
  echo $NETRC | base64 -d > ~/.netrc
  echo "copied netrc"
fi

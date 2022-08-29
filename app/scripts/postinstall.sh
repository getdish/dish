#!/bin/bash

set -eo pipefail

if [ -n "$EAS_BUILD" ]; then
  echo $NETRC | base64 -d > ~/.netrc
  echo "copied netrc"
fi

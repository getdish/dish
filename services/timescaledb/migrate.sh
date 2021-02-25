#!/bin/bash

set -e
set -x

path="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [[ $DISH_ENV == 'production' ]]; then
  USE_SSL=true
else
  USE_SSL=false
fi

pushd $path
USE_SSL=$USE_SSL ./bin/migrate.js
popd

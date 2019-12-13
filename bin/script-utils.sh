#!/bin/bash

# break on errors
set -e

APP_OLD_PWD="$(pwd)"
OLD_PATH=$PATH

cd $(dirname $0)/..

# set path/root
PATH=/usr/local/bin:/usr/bin
ROOT="$(pwd)"

# add node_modules
PATH=$OLD_PATH:$ROOT/node_modules/.bin

# cd back to original dir
cd $APP_OLD_PWD

# run with echo
function run {
  echo "$" "$@"
  eval $(printf '%q ' "$@") < /dev/tty
}

function bin-exists {
  echo "$(which $1 2> /dev/null)"
}

function file-exists {
  if [ ! -f "$1" ]; then
    echo "$1 not found"
    exit 1
  fi
}

function ensure-dep {
  cmd=${@:3}
  if [ "$(bin-exists $1)" = "" ]; then
    echo "$1 is not installed, installing..."
    if [ "$cmd" = "" ]; then
      echo "please install first!"
      exit 1
    else
      $($cmd)
    fi
  fi
}

function ensure-dir {
  cmd=${@:3}
  if [ ! -d "$1" ]; then
    echo "$1 doesnt exist, running... $cmd"
    echo $(pwd)
    $($cmd)
  fi
}

function ensure-file {
  cmd=${@:3}
  if [ ! -f "$1" ]; then
    echo "$1 doesnt exist, running... $cmd"
    echo $(pwd)
    $($cmd)
  fi
}

function ensure-symlink {
  cmd=${@:3}
  if [ ! -L "$1" ]; then
    echo "$1 doesnt exist, running... $cmd"
    $($cmd)
  fi
}


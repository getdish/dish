#!/bin/bash

. $(dirname $0)/script-utils.sh
cd $ROOT

set -e
set -u
set -x

xcode-select --install 2> /dev/null || true
ensure-dep "brew" -- /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
# install docker
# start docker
ensure-dep "multipass" -- ./bootstrap-multipass.sh

printf "\n\n"
printf "  🎉🎉🎉 bootstrapped! 🎉🎉🎉"
printf "\n\n"

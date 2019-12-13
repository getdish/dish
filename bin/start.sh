#!/bin/bash

set -e

# Clear unison caches. This is surprisingly important after rebuilds and such.
rm -rf ~/Library/Application\ Support/Unison/

export DISH_PATH=$HOME/dish

if [[ $(multipass list | grep dish | wc -l) -eq 0 ]]; then
  echo "setting up multipass vm"
  multipass launch --name dish --mem 12G --disk 80G --cpus 4

  multipass shell dish << EOF
    echo "wait"
    wait 1

    echo "setup k3s"
    curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644

    echo "setup rio"
    curl -sfL https://get.rio.io | sh -

    echo "install rio"
    rio install

    echo "all started up, lets do our initial up after mounting"
    exit
EOF
fi

echo "mounting disk..."
multipass mount $DISH_PATH dish:/app 2> /dev/null || true

printf "\n\b ✅ local dev all set up! \n\n logging into shell with: \n - multipass shell k3s\n"

multipass shell dish  << EOF
  echo "starting services"
  cd /app
  bin/up.sh
EOF

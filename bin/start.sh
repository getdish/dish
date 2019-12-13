#!/bin/bash
set -e

# Clear unison caches. This is surprisingly important after rebuilds and such.
rm -rf ~/Library/Application\ Support/Unison/

export DISH_PATH=$HOME/dish

if [[ $(multipass list | grep dish | wc -l) -eq 0 ]]; then
  echo "setting up multipass vm"
  multipass launch --name dish --mem 6G --disk 150G

  multipass shell dish << EOF
    echo "wait"
    wait 4

    echo "setup k3s"
    curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644

    echo "setup rio"
    curl -sfL https://get.rio.io | sh -

    echo "install rio"
    rio install

    echo "done"
    exit
EOF
fi

multipass mount $DISH_PATH dish:/app 2> /dev/null || true

printf "\n\b ✅ started! \n\n loging into shell with: \n - multipass shell k3s\n"

multipass shell dish

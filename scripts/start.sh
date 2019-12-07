#!/bin/bash
set -e

# Clear unison caches. This is surprisingly important after rebuilds and such.
rm -rf ~/Library/Application\ Support/Unison/

export DISH_PATH=$HOME/dish

echo "mounting $DISH_PATH to vm"
multipass mount $DISH_PATH k3s:/app

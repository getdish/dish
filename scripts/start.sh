#!/bin/bash
set -e

# Clear unison caches. This is surprisingly important after rebuilds and such.
rm -rf ~/Library/Application\ Support/Unison/

export DISH_PATH=$HOME/dish
multipass mount $DISH_PATH k3s:/app 2> /dev/null || true

printf "\n\b ✅ started! \n\n access shell with: \n - multipass shell k3s\n"

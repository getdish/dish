#!/bin/bash

# metro hates symlinks doing this for local dev :/
# use this to watch/copy all of tamagui over to starters for testing

FROM="$HOME/tamagui"
TO="$HOME/dish/node_modules"

function sync() {
  echo "syncing...."
  # copy in *all* node modules to ensure sub-deps shared (but prefer not to overwrite)
  rsync --ignore-existing -al "$FROM/node_modules/" "$TO"

  # then copy in all tamagui deps but overwrite
  rsync -a --delete -l "$FROM/packages/tamagui/" "$TO/tamagui" &
  rsync -a --delete -l "$FROM/packages/loader/" "$TO/tamagui-loader" &
  rsync -al \
    --exclude="$FROM/packages/loader/" \
    --exclude="$FROM/packages/tamagui/" \
     "$FROM/packages/" "$TO/@tamagui" &
  
  wait

  pushd "$TO" || exit
  watchman watch-del-all 2&> /dev/null
  rm -r "$TMPDIR/metro-cache" 2&> /dev/null || true
  popd || exit
}

sync
fswatch -o ~/tamagui/packages | while read f; do sync; done

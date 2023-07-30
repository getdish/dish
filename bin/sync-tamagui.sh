#!/bin/bash

# metro hates symlinks doing this for local dev :/
# use this to watch/copy all of tamagui over to starters for testing

FROM="$HOME/tamagui"
TO="$HOME/dish/node_modules"

function sync() {
  echo "syncing tamagui...."
  
  # copy in *all* non-tamagui node modules to ensure sub-deps shared (but prefer not to overwrite)
  rsync --ignore-existing -aq --exclude="*tamagui*" "$FROM/node_modules/" "$TO"

  # then copy in all tamagui deps but overwrite

  # special case (non @tamagui/*)
  rsync -a --delete "$FROM/packages/tamagui/" "$TO/tamagui" &
  rsync -a --delete "$FROM/packages/loader/" "$TO/tamagui-loader" &

  # all @tamagui/*
  rsync -a \
    --exclude="$FROM/packages/loader/" \
    --exclude="$FROM/packages/tamagui/" \
     "$FROM/packages/" "$TO/@tamagui" &
  
  wait

  pushd "$TO" > /dev/null || exit
  watchman watch-del-all 2&> /dev/null
  rm -r "$TMPDIR/metro-cache" 2&> /dev/null || true
  popd > /dev/null || exit

  rm -r node_modules/.cache || true
  rm -r app/node_modules/.cache || true

  echo "synced tamagui"
}

sync
fswatch -o ~/tamagui/packages | while read f; do sync; done

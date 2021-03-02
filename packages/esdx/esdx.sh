#!/bin/bash

set -e

SCRIPT=`realpath $0`
SCRIPTPATH=`dirname $SCRIPT`
NPM_BIN="$SCRIPTPATH/node_modules/.bin"

if [[ $NO_CHECK == true ]]; then
  echo "skip typecheck"
else
  if [ -f tsconfig.tsbuildinfo ]; then rm tsconfig.tsbuildinfo; fi
  if [ -d _ ]; then rm -r _; fi
  if [ -d dist ]; then rm -r dist; fi
  # first build types fast
  $NPM_BIN/tsc --emitDeclarationOnly
  # then copy to dist as well to only build once
  cp -r _ dist
fi

if [ $SWC ]; then
  DIR=$(dirname $(realpath $0))
  swc src -s -c $DIR/.swcrc-modern --out-dir _ &
  swc src -s -c $DIR/.swcrc-node --out-dir dist &
else
  FILES=$(find ./src \( -name '*.ts' -o -name '*.tsx' \))
  $NPM_BIN/esbuild $FILES --sourcemap --outdir=_  --target=safari13 "$@" &
  $NPM_BIN/esbuild $FILES --sourcemap --outdir=dist --format=cjs --target=node12.19.0 "$@" &
fi

wait

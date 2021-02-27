#!/bin/bash

shift 1

if [[ $NO_CHECK == true ]]; then
  echo "skip typecheck"
else
  # first build types fast
  tsc --emitDeclarationOnly --skipLibCheck
  # then copy to dist as well to only build once
  rm -r dist || true && cp -r _ dist
fi

# then build logic fast...
FILES=$(find ./src \( -name '*.ts' -o -name '*.tsx' \))
esbuild $FILES --outdir=_ "$@" &
esbuild $FILES --outdir=dist --format=cjs --target=node12.19.0 "$@" &
wait
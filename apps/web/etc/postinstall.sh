#!/bin/bash

jetify
rm -r node_modules/@apollo/client/node_modules/react || true
yarn patch-package

# fix our commonjs plugin
(cd node_modules/@rollup/plugin-commonjs && yarn rollup -c)

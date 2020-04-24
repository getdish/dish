#!/bin/bash

jetify
rm -r node_modules/@apollo/client/node_modules/react || true
patch-package --patch-dir ./etc/patches

# fix our commonjs plugin
(cd node_modules/@rollup/plugin-commonjs && yarn rollup -c)

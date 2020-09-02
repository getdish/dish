#!/bin/bash

# jetify
yarn patch-package

# fix our commonjs plugin
# (cd node_modules/@rollup/plugin-commonjs && yarn rollup -c)

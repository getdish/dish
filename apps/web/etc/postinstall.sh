#!/bin/bash

jetify
rm -r node_modules/@apollo/client/node_modules/react || true
patch-package --patch-dir ./etc/patches

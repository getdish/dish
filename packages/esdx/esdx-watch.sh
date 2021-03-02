#!/bin/bash

DIR=$(dirname $(realpath $0))

chokidar src -c "$DIR/esdx.sh"

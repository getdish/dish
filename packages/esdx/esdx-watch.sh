#!/bin/bash

DIR=$(dirname $(realpath $0))

chokidar src -c "NO_CHECK=true $DIR/esdx.sh"

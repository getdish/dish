#!/bin/sh

while true; do
  sleep 1800
  killall chrome
done &

echo "starting worker..."
xvfb-run node --expose-gc ./dist/index.js

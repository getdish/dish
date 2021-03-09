#!/bin/sh

while true; do
  sleep 1800
  killall chrome
done &

xvfb-run node --expose-gc ./dist/index.js

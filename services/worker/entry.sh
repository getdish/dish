#!/bin/sh

while true; do
  sleep 1800
  killall chrome
done &

xvfb-run node --expose-gc /app/services/worker/_/index.js

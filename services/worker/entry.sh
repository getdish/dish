#!/bin/sh

while true; do
  sleep 1800
  killall chrome
done &

xvfb-run node /app/services/worker/_/index.js

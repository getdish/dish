#!/bin/sh

while true; do
  sleep 1800
  killall chrome
done &

console.log("??")

xvfb-run node --expose-gc /app/services/worker/dist/index.js

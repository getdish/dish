#!/bin/sh

printenv | grep -v "no_proxy" >> /etc/environment

echo "Starting Cron container..."

/etc/init.d/cron start

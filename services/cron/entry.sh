#!/bin/sh

printenv | grep -v "no_proxy" >> /etc/environment

echo "Starting Cron container..."
/usr/sbin/crond -f -l 8

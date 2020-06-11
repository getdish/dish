#!/bin/sh

printenv | grep -v "no_proxy" >> /etc/environment

echo "Starting crawler scheduler..."
/usr/sbin/cron -f -l 8

#!/bin/sh

printenv | grep -v "no_proxy" >> /etc/environment

./dishctl.sh init_doctl
kubectl version

echo "Starting Cron container..."
/usr/sbin/crond -f -l 8

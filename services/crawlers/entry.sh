#!/bin/sh

printenv | grep -v "no_proxy" >> /etc/environment

# Rsyslog is needed for cron to log to
service rsyslog start

# List all current cron jobs
crontab -l

echo "Starting crawler scheduler..."
/usr/sbin/cron -f -L 15

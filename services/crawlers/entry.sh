#!/bin/sh

printenv | grep -v "no_proxy" >> /etc/environment
CRON_LOG=/var/log/cron.log

# Rsyslog is needed for cron to log to
service rsyslog start

# List all current cron jobs
crontab -l

# Rsyslog is needed for cron to log to
service rsyslog start

# List all current cron jobs
crontab -l

echo "Starting crawler scheduler..."
/usr/sbin/cron -L 15

touch $CRON_LOG
tail -f $CRON_LOG

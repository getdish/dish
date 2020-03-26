#!/bin/sh

echo "Starting Postgres backups container..."
/usr/sbin/crond -f -l 8

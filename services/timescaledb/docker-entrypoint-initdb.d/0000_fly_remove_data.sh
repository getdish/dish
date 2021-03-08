#!/bin/bash
set -e

rm -r /var/lib/postgresql/data/lost+found || true

echo "fly fix applied"

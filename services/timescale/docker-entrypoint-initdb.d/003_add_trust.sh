#!/bin/bash
set -e

# fly fix
# rm -r /var/lib/postgresql/data/lost+found || true

echo "adding trust"
echo "host all all all trust" >> /var/lib/postgresql/data/pg_hba.conf

echo "done modifying"

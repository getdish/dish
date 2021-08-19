function list_backups() {
  s3 ls "s3://$DISH_BACKUP_BUCKET" | sort -k1,2
}

function backup_main_db() {
  set -e
  echo "backing up main db..."
  DUMP_FILE_NAME="dish-$DISH_ENV-db-backup-$(date +%Y-%m-%d-%H-%M).dump"
  pg_dump "$POSTGRES_URL" \
    -C -w --format=c |
    s3 put - "s3://$DISH_BACKUP_BUCKET/$DUMP_FILE_NAME"
  echo 'Successfully backed up main database'
}

function backup_scrape_db() {
  set -e
  echo "backing up scrape db..."
  DUMP_FILE_NAME="dish-$DISH_ENV-scrape-backup-$(date +%Y-%m-%d-%H-%M).dump"
  pg_dump "$TIMESCALE_URL" -C -w --format=c |
    s3 put - "s3://$DISH_BACKUP_BUCKET/$DUMP_FILE_NAME"
  echo 'Successfully backed up scrape database'
}

function get_all_backups() {
  s3 ls "s3://$DISH_BACKUP_BUCKET"
}

function get_latest_main_backup() {
  echo $(
    s3 ls s3://$DISH_BACKUP_BUCKET | grep 'dish-db' | tail -1 | awk '{ print $4 }'
  )
}

function get_latest_scrape_backup() {
  echo $(
    s3 ls s3://$DISH_BACKUP_BUCKET |
      grep "dish-scrape-backup" |
      tail -1 |
      awk '{ print $4 }'
  )
}

# note: to restore the db ideally we'd start an instance of postgres on the side on diff port/data dir
#       and restore to that, then cp to /var/data/postgresql/production and dsh docker_restart dish_postgres
function restore_postgres_tmp_backup() {
  # docker run registry.dishapp.com/dish-postgres &
  dump_file="${1:-/tmp/latest_dish_backup.dump}"
  PGPASSWORD=$POSTGRES_PASSWORD pg_restore \
    -j 6 \
    --no-owner \
    --role="$POSTGRES_USER" \
    -h "$POSTGRES_HOST" \
    -U "$POSTGRES_USER" \
    -p "$POSTGRES_PORT" \
    -d "$POSTGRES_DB" \
    "$dump_file"
}

function restore_latest_main_backup() {
  latest_backup=$(get_latest_main_backup)
  dump_file="/tmp/latest_dish_backup.dump"
  log_command s3 get "$latest_backup" "$dump_file"
  # restore_postgres_tmp_backup
}

function restore_timescale_tmp_backup() {
  dump_file="/tmp/latest_scrape_backup.dump"
  PGPASSWORD=$TIMESCALE_PASSWORD pg_restore \
    -j 6 \
    --no-owner \
    --role="$TIMESCALE_USER" \
    -h "$TIMESCALE_HOST" \
    -U "$TIMESCALE_USER" \
    -p "$TIMESCALE_PORT" \
    -d "$TIMESCALE_DB" "$dump_file"
}

function restore_latest_scrapes_backup() {
  latest_backup=$(get_latest_scrape_backup)
  dump_file="/tmp/latest_scrape_backup.dump"
  log_command s3 get "$latest_backup" "$dump_file"
  restore_timescale_tmp_backup
}

function grafana_backup() {
  _run_on_cluster $DISH_REGISTRY/grafana-backup-tool && return 0
  set -e
  export GRAFANA_TOKEN="$GRAFANA_API_KEY"
  export GRAFANA_URL=https://grafana.k8s.dishapp.com
  grafana-backup save
  backup=$(ls _OUTPUT_/)
  destination=$DISH_BACKUP_BUCKET/grafan-backups
  s3 put _OUTPUT_/$backup $destination/$backup
  s3 ls $destination/ | sort -k1,2
}

function rsync_server_backup() {
  echo "backing up..."
  ionice -c2 -n7 \
    rsync -aAXv / \
    --exclude={ "/var/data/docker/*", "/dev/*","/proc/*", "/sys/*", "/tmp/*", "/run/*", "/mnt/*", "/media/*", "/lost+found" \
    } de1257@de1257.rsync.net:backup
}

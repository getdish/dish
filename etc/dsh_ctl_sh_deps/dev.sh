function dish_app_generate_tags() {
  export HASURA_ENDPOINT=https://hasura.dishapp.com
  export IS_LIVE=1
  pushd $PROJECT_ROOT/app
  node -r esbuild-register ./etc/generate_tags.ts
}

function find_app() {
  find "$PROJECT_ROOT" -type d \( -name node_modules -o -name packages -o -name dist -o -name _ -o -name src \) -prune -false -o -type d -name "$1" | head -n 1
}

function clean_build() {
  find $PROJECT_ROOT -type d \( -name node_modules \) -prune -false -o -name "_" -type d -prune -exec rm -rf '{}' \; &
  find $PROJECT_ROOT -type d \( -name node_modules \) -prune -false -o -name "dist" -type d -prune -exec rm -rf '{}' \; &
  find $PROJECT_ROOT -type d \( -name node_modules \) -prune -false -o -name "tsconfig.tsbuildinfo" -prune -exec rm -rf '{}' \; &
  find $PROJECT_ROOT -type d \( -name node_modules \) -prune -false -o -name ".ultra.cache.json" -prune -exec rm -rf '{}' \; &
  wait
}

function clean() {
  clean_build
  find $PROJECT_ROOT -name "node_modules" -type d -prune -exec rm -rf '{}' \;
  find $PROJECT_ROOT -name "yarn-error.log" -prune -exec rm -rf '{}' \;
}

function run() {
  echo "executing: $ORIGINAL_ARGS in $CWD_DIR"
  pushd "$CWD_DIR"
  bash -c "$ORIGINAL_ARGS"
  popd
}

function sync_to() {
  hostvar="$1_HOST"
  host="${!hostvar}"
  key="$PROJECT_ROOT/etc/keys/server_rsa"
  if [ "$host" = "" ] || [ ! -f "$key" ]; then
    echo "no host or private key $host $key"
    exit 1
  fi
  chmod 600 "$key"
  echo " ⬆️  syncing . to $host:/app"
  rsync \
    -avPq --force \
    --exclude-from="$(git -C . ls-files --exclude-standard -oi --directory > /tmp/excludes; echo /tmp/excludes)" \
    --exclude='- .git' \
    -e "ssh -o StrictHostKeyChecking=no -i $key" . "root@$host:/app"
  echo "synced"
}
export -f sync_to

function sync_to_watch() {
  sync_to "$1"
  fswatch -0 -o path . | xargs -0 -n1 -I{} sh -c "sync_to $1"
}

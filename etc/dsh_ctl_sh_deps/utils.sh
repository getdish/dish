function generate_random_port() {
  echo "2$((1000 + RANDOM % 8999))"
}

function s3() {
  s3cmd \
    --host sfo2.digitaloceanspaces.com \
    --host-bucket '%(bucket).sfo2.digitaloceanspaces.com' \
    --access_key "$DO_SPACES_ID" \
    --secret_key "$DO_SPACES_SECRET" \
    --human-readable-sizes \
    "$@"
}

function disk_speed() {
  dd if=/dev/zero of=/tmp/test2.img bs=512 count=100 oflag=dsync
}

function source_env() {
  source .env
  arch="$(uname -m)"
  if [ "${arch}" = "arm64" ]; then
    source .env.m1
  fi
  # source current env next, .env.production by default
  if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
  else
    echo "Not loading ENV from $ENV_FILE as it doesn't exist"
  fi
  if [ "$IS_LOCAL" = "1" ]; then
    source .env.local
  fi
}

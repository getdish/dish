#!/usr/bin/env bash
set -e
set -x

echo "Decrypting Dish secrets..."

KEY_PATH=/tmp/gitcrypt-key

apt-get install -y git-crypt

echo "import key"
echo "$GPG_KEY" > key
gpg --import key
gpg --list-keys
git reset --hard
git-crypt unlock

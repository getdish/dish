#!/usr/bin/env bash
set -e

echo "Decrypting Dish secrets..."
KEY_PATH=/tmp/gitcrypt-key
sudo apt-get install -y git-crypt
echo $GITCRYPT_KEY > $KEY_PATH.base64
cat $KEY_PATH.base64 | base64 -d > $KEY_PATH
git reset --hard
git-crypt unlock $KEY_PATH

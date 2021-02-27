#!/usr/bin/env bash
set -e
set -x

echo "Decrypting Dish secrets..."
KEY_PATH=/tmp/gitcrypt-key
apt-get install -y git-crypt
echo $GITCRYPT_KEY
echo $GITCRYPT_KEY > $KEY_PATH.base64
cat $KEY_PATH.base64 | base64 -d > $KEY_PATH
git reset --hard
cat $KEY_PATH
git-crypt unlock $KEY_PATH

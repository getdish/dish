apt-get install -y docker docker-compose nodejs npm
curl -o- -L https://yarnpkg.com/install.sh | bash

if [ ! -f /usr/local/bin/hasura ]; then
  curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash
fi

./.github/workflows/scripts/decrypt_creds.sh

PATH=$PATH:$HOME/bin
mkdir -p $HOME/bin

export PATH=$PATH:"$HOME/bin/google-cloud-sdk/bin"

./dishctl.sh install_gcloud_sdk

ls -la $HOME/bin/google-cloud-sdk/bin

echo "done"

PWD=$(pwd)
export GOOGLE_APPLICATION_CREDENTIALS="$PWD/k8s/etc/dish-gcloud.enc.json"

echo $GOOGLE_APPLICATION_CREDENTIALS

echo "https://gcr.io" | docker-credential-gcr get


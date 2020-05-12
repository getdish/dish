#!/usr/bin/env bash
set -e

sudo swapoff -a
sudo rm -f /swapfile
sudo apt clean
sudo rm -rf /usr/local/lib/android
sudo rm -rf /usr/share/dotnet
df -h

docker build -t dish/worker -f services/worker/Dockerfile . &
docker build -t dish/crawlers -f services/crawlers/Dockerfile . &
docker build -t dish/web -f apps/web/Dockerfile .

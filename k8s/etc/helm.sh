#!/usr/bin/env bash
# See: https://github.com/helm/helm/issues/3130#issuecomment-372931407
# Hopefully this isn't needed for Helm > v3

helm init

kubectl --namespace kube-system create serviceaccount tiller

kubectl create clusterrolebinding tiller-cluster-rule \
 --clusterrole=cluster-admin --serviceaccount=kube-system:tiller

kubectl --namespace kube-system patch deploy tiller-deploy \
 -p '{"spec":{"template":{"spec":{"serviceAccount":"tiller"}}}}'

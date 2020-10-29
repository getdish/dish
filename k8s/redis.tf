resource "kubernetes_namespace" "redis" {
  metadata {
    name = "redis"
  }
}

resource "helm_release" "redis" {
  name = "redis"
  namespace = "redis"
  repository = "redis"
  chart = "bitnami/redis"
  version = "10.7.12"

  values = [
    file("yaml/redis.yaml")
  ]

  set {
    name = "cluster.enabled"
    value = "false"
  }

  set {
    name = "usePassword"
    value = "false"
  }
  set {
    name = "metrics.enabled"
    value = "true"
  }

  set {
    name = "master.disableCommands"
    value = ""
  }
}

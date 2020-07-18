resource "helm_release" "redis" {
  name = "redis"
  namespace = "redis"
  chart = "stable/redis"
  version = "10.5.7"

  set {
    name ="config.configYml"
    value = file("yaml/redis.yaml")
  }

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

resource "kubernetes_namespace" "logging" {
  metadata {
    name = "logging"
  }
}

data "helm_repository" "loki" {
  name = "loki"
  url  = "https://grafana.github.io/loki/charts"
}

resource "helm_release" "loki" {
  name      = "loki"
  namespace = "logging"
  repository = data.helm_repository.loki.metadata.0.name
  chart     = "loki/loki-stack"
  version = "0.40.1"
  values = [
    file("yaml/loki.yaml")
  ]
}

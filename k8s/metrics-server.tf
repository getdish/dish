resource "kubernetes_namespace" "metrics-server" {
  metadata {
    name = "metrics-server"
  }
}

resource "helm_release" "metrics-server" {
  name = "metrics-server"
  namespace = "metrics-server"
  chart = "stable/metrics-server"
  version = "2.11.1"

  values = [
    file("yaml/metrics-server.yaml")
  ]
}

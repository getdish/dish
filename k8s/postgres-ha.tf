resource "kubernetes_namespace" "postgres-ha" {
  metadata {
    name = "postgres-ha"
  }
}

data "helm_repository" "bitnami" {
  name = "bitnami"
  url  = "https://charts.bitnami.com/bitnami"
}

resource "helm_release" "postgres-ha" {
  name = "postgres-ha"
  namespace = "postgres-ha"
  chart = "bitnami/postgresql-ha"
  version = "3.5.1"

  values = [
    file("yaml/postgres-ha.yaml")
  ]

  set {
    name = "global.postgresql.password"
    value = var.POSTGRES_PASSWORD
  }
}

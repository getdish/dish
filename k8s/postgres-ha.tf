resource "kubernetes_namespace" "postgres-ha" {
  metadata {
    name = "postgres-ha"
  }
}

resource "helm_release" "postgres-ha" {
  name = "postgres-ha"
  namespace = "postgres-ha"
  chart = "bitnami/postgresql-ha"
  version = "3.5.3"

  values = [
    file("yaml/postgres-ha.yaml")
  ]

  set {
    name = "global.postgresql.password"
    value = var.POSTGRES_PASSWORD
  }

  set {
    name = "global.postgresql.repmgrPassword"
    value = var.POSTGRES_REPMGR_PASSWORD
  }
}

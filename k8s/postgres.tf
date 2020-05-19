resource "helm_release" "postgres" {
  name = "postgres"
  namespace = "postgres"
  chart = "stable/postgresql"
  version = "8.6.4"

  values = [
    file("yaml/postgres.yaml")
  ]

  set {
    name = "postgresqlDatabase"
    value = "dish"
  }
  set {
    name = "postgresqlPassword"
    value = var.POSTGRES_PASSWORD
  }
}

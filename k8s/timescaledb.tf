resource "kubernetes_namespace" "timescale" {
  metadata {
    name = "timescale"
  }
}

data "helm_repository" "timescale" {
  name = "timescale"
  url  = "https://raw.githubusercontent.com/timescale/timescaledb-kubernetes/master/charts/repo/"
}

resource "helm_release" "timescaledb" {
  name = "timescale"
  namespace = "timescale"
  chart = "timescale/timescaledb-single"
  version = "0.6.2"

  values = [
    file("yaml/timescale.yaml")
  ]
}

resource "kubernetes_secret" "timescale-credentials" {
  depends_on = [kubernetes_namespace.timescale]

  metadata {
    name      = "timescale-credentials"
    namespace = "timescale"
  }

  data = {
    "PATRONI_SUPERUSER_PASSWORD" = var.TIMESCALE_SU_PASS
    "PATRONI_REPLICATION_PASSWORD" = var.TIMESCALE_REPLICATION_PASS
    "PATRONI_admin_PASSWORD" = var.TIMESCALE_ADMIN_PASS
  }

  type = "Opaque"
}

resource "kubernetes_secret" "timescale-certificates" {
  depends_on = [kubernetes_namespace.timescale]

  metadata {
    name      = "timescale-certificate"
    namespace = "timescale"
  }

  data = {
    "tls.key" = file("etc/certs/timescale/tls.key")
    "tls.crt" = file("etc/certs/timescale/tls.crt")
  }

  type = "kubernetes.io/tls"
}

resource "null_resource" "create-timescaledb-setup" {
  depends_on = [helm_release.timescaledb]

  provisioner "local-exec" {
    command = <<EOC
set -e
echo "Creating TimescaleDB..."

etc/create_timescale_db.sh

echo "...TimescaleDB created."
EOC
  }
}

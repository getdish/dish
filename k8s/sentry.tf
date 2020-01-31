
resource "null_resource" "create-sentry-db" {
  depends_on = [helm_release.postgres]

  provisioner "local-exec" {
    command = <<EOC
echo "Ensuring 'sentry' database exists"

POSTGRES_PASSWORD=${var.POSTGRES_PASSWORD} ./etc/ensure_extra_dbs_exist.sh

EOC
  }
}

resource "helm_release" "sentry" {
  depends_on = [null_resource.create-sentry-db]

  name      = "sentry"
  namespace = "sentry"
  chart     = "stable/sentry"
  version = "4.0.0"

  set {
    name  = "postgresql.enabled"
    value = false
  }

  set {
    name  = "postgresql.postgresqlPassword"
    value = var.POSTGRES_PASSWORD
  }

  set {
    name  = "postgresql.postgresqlHost"
    value = "postgres-postgresql.postgres"
  }

  set {
    name  = "redis.enabled"
    value = false
  }

  set {
    name  = "redis.host"
    value = "redis-master.redis"
  }

  set {
    name  = "service.type"
    value = "ClusterIP"
  }

  set {
    name  = "persistence.size"
    value = "5Gi"
  }
}

resource "kubernetes_ingress" "sentry-ingress" {
  metadata {
    name = "sentry-ingress"
    namespace = "sentry"
    annotations = {
      "kubernetes.io/ingress.class" = "nginx"
      "cert-manager.io/cluster-issuer": "letsencrypt-prod"
      "cert-manager.io/acme-challenge-type": "http01"
    }
  }
  spec {
    tls {
      hosts = [
        "sentry.k8s.${var.dish_domain}",
      ]
      secret_name = "sentry-tls"
    }
    backend {
      service_name = "sentry"
      service_port = 9000
    }
    rule {
      host = "sentry.k8s.${var.dish_domain}"
      http {
        path {
          path = "/*"
          backend {
            service_name = "sentry"
            service_port = 9000
          }
        }
      }
    }
  }
}


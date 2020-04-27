
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
  version = "4.2.1"

  set {
    name ="config.configYml"
    value = file("yaml/sentry.yaml")
  }

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
    name  = "persistence.size"
    value = "5Gi"
  }

  set {
    name  = "service.type"
    value = "ClusterIP"
  }

  set {
    name  = "email.host"
    value = "smtp.gmail.com"
  }

  set {
    name  = "email.port"
    value = "587"
  }

  set {
    name  = "email.user"
    value = "teamdishapp@gmail.com"
  }

  set {
    name  = "email.password"
    value = var.GMAIL_APP_PASSWORD
  }

  set {
    name  = "email.use_tls"
    value = "true"
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

resource "helm_release" "k8s-errors" {
  name      = "sentry-k8s"
  namespace = "sentry"
  chart     = "incubator/sentry-kubernetes"

  set {
    name ="sentry.dsn"
    value = var.K8S_DSN
  }
}

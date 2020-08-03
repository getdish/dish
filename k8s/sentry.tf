resource "kubernetes_namespace" "sentry" {
  metadata {
    name = "sentry"
  }
}

data "helm_repository" "sentry" {
  name = "sentry"
  url  = "https://sentry-kubernetes.github.io/charts"
}

resource "helm_release" "sentry-k8s-erros" {
  name       = "sentry-k8s-errors"
  namespace  = "sentry"
  repository = "sentry"
  chart      = "sentry-kubernetes"
  version    = "0.3.1"

  set {
    name ="sentry.dsn"
    value = var.K8S_DSN
  }
}

resource "helm_release" "sentry" {
  name       = "sentry"
  namespace  = "sentry"
  repository = "sentry"
  chart      = "sentry"
  version    = "4.7.2"

  set {
    name ="config.configYml"
    value = file("yaml/sentry.yaml")
  }

  set {
    name ="postgresql.postgresqlPassword"
    value = var.SENTRY_PG_PASS
  }

  set {
    name  = "persistence.size"
    value = "25Gi"
  }

  set {
    name  = "service.type"
    value = "ClusterIP"
  }

  set {
    name  = "user.email"
    value = "teamdishapp@gmail.com"
  }

  set {
    name  = "user.password"
    value = var.SENTRY_USER_PASS
  }

  set {
    name  = "mail.backend"
    value = "smtp"
  }

  set {
    name  = "mail.host"
    value = "smtp.gmail.com"
  }

  set {
    name  = "mail.port"
    value = "587"
  }

  set {
    name  = "mail.username"
    value = "teamdishapp@gmail.com"
  }

  set {
    name  = "mail.password"
    value = var.GMAIL_APP_PASSWORD
  }

  set {
    name  = "mail.useTls"
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
      service_name = "sentry-web"
      service_port = 9000
    }
    rule {
      host = "sentry.k8s.${var.dish_domain}"
      http {
        path {
          path = "/*"
          backend {
            service_name = "sentry-web"
            service_port = 9000
          }
        }
      }
    }
  }
}


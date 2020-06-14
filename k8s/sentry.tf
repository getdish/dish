resource "helm_release" "sentry" {
  name      = "sentry"
  namespace = "sentry"
  chart     = "stable/sentry"
  version = "4.2.4"

  set {
    name ="config.configYml"
    value = file("yaml/sentry.yaml")
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

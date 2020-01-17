resource "kubernetes_deployment" "hasura" {
  metadata {
    name = "hasura"
  }
  spec {
    selector {
      match_labels = {
        app = "hasura"
      }
    }
    replicas = 1
    strategy {
      type = "RollingUpdate"
      rolling_update {
        max_unavailable = 0
        max_surge = 1
      }
    }
    template {
      metadata {
        labels = {
          app = "hasura"
      }
        }
      spec {
        container {
          name  = "app"
          image = "hasura/graphql-engine:v1.0.0"

          env {
            name = "HASURA_GRAPHQL_DATABASE_URL"
            value = "postgres://postgres:${var.postgres_password}@postgres-postgresql.postgres/dish"
          }

          # These settings dictate the status of the container for deciding whether the
          # service is ready to replace the old version during deployment.
          readiness_probe {
            http_get {
              path   = "/healthz"
              port   = "8080"
              scheme = "HTTP"
            }
            initial_delay_seconds = 5
            timeout_seconds   = 5
            period_seconds    = 5
            success_threshold = 1
            failure_threshold = 3
          }

          port {
            container_port = 8080
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "hasura" {
  metadata {
    name = "hasura"
  }

  spec {
    selector = {
      app = "hasura"
    }

    port {
      name = "hasura"
      port = 80
      target_port = 8080
    }
  }
}

resource "kubernetes_ingress" "hasura-ingress" {
  metadata {
    name = "hasura-ingress"
    annotations = {
      "kubernetes.io/ingress.class" = "nginx"
      "cert-manager.io/cluster-issuer": "letsencrypt-prod"
      "cert-manager.io/acme-challenge-type": "http01"
    }
  }
  spec {
    tls {
      hosts = [
        "hasura.${var.dish_domain}",
      ]
      secret_name = "hasura-tls"
    }
    backend {
      service_name = "hasura"
      service_port = 80
    }
    rule {
      host = "hasura.${var.dish_domain}"
      http {
        path {
          path = "/*"
          backend {
            service_name = "hasura"
            service_port = 80
          }
        }
      }
    }
  }
}


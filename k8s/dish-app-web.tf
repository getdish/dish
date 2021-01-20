resource "kubernetes_deployment" "dish-app-web" {
  lifecycle {
    ignore_changes = [
      spec[0].replicas
    ]
  }
  metadata {
    name = "dish-app-web"
  }
  spec {
    selector {
      match_labels = {
        app = "dish-app-web"
      }
    }
    template {
      metadata {
        labels = {
          app = "dish-app-web"
        }
      }
      spec {
        node_selector = {
          "doks.digitalocean.com/node-pool" = "dish-critical-pool"
        }

        image_pull_secrets {
          name = "docker-config-json"
        }

        toleration {
          key = "dish-taint"
          operator = "Equal"
          value = "critical-only"
          effect = "NoSchedule"
        }


        container {
          name  = "dish-app-web"
          image = "${var.DOCKER_REGISTRY}/dish-app:production"
          image_pull_policy = "Always"
          env {
            name = "DISH_ENV"
            value = "production"
          }
          env {
            name = "HASURA_ENDPOINT"
            value = var.HASURA_ENDPOINT
          }
          env {
            name = "HASURA_SECRET"
            value = var.HASURA_GRAPHQL_ADMIN_SECRET
          }
          env {
            name = "ADMIN_PASSWORD"
            value = var.JWT_ADMIN_PASSWORD
          }
          env {
            name = "DO_SPACES_ID"
            value = var.DO_SPACES_ID
          }
          env {
            name = "DO_SPACES_SECRET"
            value = var.DO_SPACES_SECRET
          }
          env {
            name = "SENDGRID_API_KEY"
            value = var.SENDGRID_API_KEY
          }
          env {
            name = "JWT_SECRET"
            value = var.JWT_KEY
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "dish-app-web" {
  metadata {
    name = "dish-app-web"
  }

  spec {
    selector = {
      app = "dish-app-web"
    }

    port {
      name = "http"
      port = 4444
      target_port = 4444
    }
  }
}

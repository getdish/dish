resource "kubernetes_deployment" "jwt-server" {
  lifecycle {
    ignore_changes = [
      "spec[0].replicas"
    ]
  }

  metadata {
    name = "jwt-server"
  }
  spec {
    selector {
      match_labels = {
        app = "jwt-server"
      }
    }
    template {
      metadata {
        labels = {
          app = "jwt-server"
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
          name  = "jwt-server"
          image = "docker.k8s.dishapp.com/dish/jwt-server"
          env {
            name = "DISH_ENV"
            value = "production"
          }
          env {
            name = "ADMIN_PASSWORD"
            value = var.JWT_ADMIN_PASSWORD
          }
          env {
            name = "JWT_SECRET"
            value = var.JWT_KEY
          }
          env {
            name = "POSTGRES_HOST"
            value = var.POSTGRES_HOST
          }
          env {
            name = "POSTGRES_PASSWORD"
            value = var.POSTGRES_PASSWORD
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "jwt-server" {
  metadata {
    name = "jwt-server"
  }
  spec {
    selector = {
      app = "jwt-server"
    }
    port {
      name = "http"
      port = 3000
      target_port = 3000
    }
  }
}



resource "kubernetes_deployment" "user-server" {
  lifecycle {
    ignore_changes = [
      "spec[0].replicas"
    ]
  }

  metadata {
    name = "user-server"
  }
  spec {
    selector {
      match_labels = {
        app = "user-server"
      }
    }
    template {
      metadata {
        labels = {
          app = "user-server"
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
          name  = "user-server"
          image = "docker.k8s.dishapp.com/dish/user-server"
          env {
            name = "DISH_ENV"
            value = "production"
          }
          env {
            name = "ADMIN_PASSWORD"
            value = var.JWT_ADMIN_PASSWORD
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
          env {
            name = "DO_SPACES_ID"
            value = var.DO_SPACES_ID
          }
          env {
            name = "DO_SPACES_SECRET"
            value = var.DO_SPACES_SECRET
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "user-server" {
  metadata {
    name = "user-server"
  }
  spec {
    selector = {
      app = "user-server"
    }
    port {
      name = "http"
      port = 3000
      target_port = 3000
    }
  }
}



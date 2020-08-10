resource "kubernetes_deployment" "web" {
  metadata {
    name = "web"
  }
  spec {
    selector {
      match_labels = {
        app = "web"
      }
    }
    template {
      metadata {
        labels = {
          app = "web"
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
          name  = "web"
          image = "docker.k8s.dishapp.com/dish/web"
          env {
            name = "DISH_ENV"
            value = "production"
          }
          env {
            name = "HASURA_ENDPOINT"
            value = var.HASURA_ENDPOINT
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "web" {
  metadata {
    name = "web"
  }

  spec {
    selector = {
      app = "web"
    }

    port {
      name = "http"
      port = 19006
      target_port = 19006
    }
  }
}


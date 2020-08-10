resource "kubernetes_deployment" "search" {
  metadata {
    name = "search"
  }
  spec {
    selector {
      match_labels = {
        app = "search"
      }
    }
    template {
      metadata {
        labels = {
          app = "search"
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
          name  = "search"
          image = "docker.k8s.dishapp.com/dish/search"
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

resource "kubernetes_service" "search" {
  metadata {
    name = "search"
  }
  spec {
    selector = {
      app = "search"
    }
    port {
      name = "http"
      port = 10000
      target_port = 10000
    }
  }
}




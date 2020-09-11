resource "kubernetes_deployment" "absa" {
  lifecycle {
    ignore_changes = [
      "spec[0].replicas"
    ]
  }
  metadata {
    name = "absa"
  }
  spec {
    selector {
      match_labels = {
        app = "absa"
      }
    }
    template {
      metadata {
        labels = {
          app = "absa"
        }
      }
      spec {
        node_selector = {
          "doks.digitalocean.com/node-pool" = "dish-ancillary-pool"
        }
        image_pull_secrets {
          name = "docker-config-json"
        }
        container {
          name  = "app"
          image = "docker.k8s.dishapp.com/dish/absa"
          resources {
            limits {
              cpu    = "2"
              memory = "6Gi"
            }
          }
          env {
            name = "WORKERS_PER_CORE"
            value = "0.5"
          }
          port {
            container_port = 80
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "absa" {
  metadata {
    name = "absa"
  }

  spec {
    selector = {
      app = "absa"
    }

    port {
      name = "http"
      port = 5000
      target_port = 80
    }
  }
}


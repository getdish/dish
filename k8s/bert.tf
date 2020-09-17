resource "kubernetes_deployment" "bert" {
  lifecycle {
    ignore_changes = [
      "spec[0].replicas"
    ]
  }
  metadata {
    name = "bert"
  }
  spec {
    selector {
      match_labels = {
        app = "bert"
      }
    }
    template {
      metadata {
        labels = {
          app = "bert"
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
          image = "docker.k8s.dishapp.com/dish/bert"
          resources {
            limits {
              cpu    = "2"
              memory = "5Gi"
            }
          }
          port {
            container_port = 8080
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "bert" {
  metadata {
    name = "bert"
  }

  spec {
    selector = {
      app = "bert"
    }

    port {
      name = "http"
      port = 5000
      target_port = 8080
    }
  }
}


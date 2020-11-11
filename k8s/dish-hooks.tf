resource "kubernetes_deployment" "dish-hooks" {
  lifecycle {
    ignore_changes = [
      spec[0].replicas
    ]
  }

  metadata {
    name = "dish-hooks"
  }
  spec {
    selector {
      match_labels = {
        app = "dish-hooks"
      }
    }
    template {
      metadata {
        labels = {
          app = "dish-hooks"
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
          name  = "dish-hooks"
          image = "docker.k8s.dishapp.com/dish/dish-hooks"
          env {
            name = "DISH_ENV"
            value = "production"
          }
          env {
            name = "GORSE_ENDPOINT"
            value = "http://gorse:9000"
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

resource "kubernetes_service" "dish-hooks" {
  metadata {
    name = "dish-hooks"
  }
  spec {
    selector = {
      app = "dish-hooks"
    }
    port {
      name = "http"
      port = 6154
      target_port = 6154
    }
  }
}



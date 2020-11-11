resource "kubernetes_deployment" "martin-tiles" {
  lifecycle {
    ignore_changes = [
      spec[0].replicas
    ]
  }
  metadata {
    name = "martin-tiles"
  }
  spec {
    selector {
      match_labels = {
        app = "martin-tiles"
      }
    }
    template {
      metadata {
        labels = {
          app = "martin-tiles"
        }
      }
      spec {
        node_selector = {
          "doks.digitalocean.com/node-pool" = "dish-critical-pool"
        }


        toleration {
          key = "dish-taint"
          operator = "Equal"
          value = "critical-only"
          effect = "NoSchedule"
        }


        container {
          name  = "martin-tiles"
          image = "urbica/martin"
          env {
            name = "DATABASE_URL"
            value = "postgres://postgres:${var.POSTGRES_PASSWORD}@${var.POSTGRES_HOST}/dish"
          }
          env {
            name = "WATCH_MODE"
            value = "true"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "martin-tiles" {
  metadata {
    name = "martin-tiles"
  }
  spec {
    selector = {
      app = "martin-tiles"
    }
    port {
      name = "http"
      port = 3000
      target_port = 3000
    }
  }
}




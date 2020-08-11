resource "kubernetes_deployment" "image-proxy" {
  metadata {
    name = "image-proxy"
  }
  spec {
    selector {
      match_labels = {
        app = "image-proxy"
      }
    }
    strategy {
      type = "Recreate"
    }
    template {
      metadata {
        labels = {
          app = "image-proxy"
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
          name  = "image-proxy"
          image = "willnorris/imageproxy@sha256:9cc15ad4b0f61e371a982c5fa0520cd6f6cebba317bb1a9188ac9169a826fc35"
          args = [
            "-addr", "0.0.0.0:8080",
            "-cache", "/image-cache"
          ]
          volume_mount {
            name = "image-proxy-pvc"
            mount_path = "/image-cache"
          }
        }

        volume {
          name = "image-proxy-pvc"
          persistent_volume_claim {
            claim_name = "image-proxy-pvc"
          }
        }
      }
    }
  }
}

resource "kubernetes_persistent_volume_claim" "image-proxy" {
  metadata {
    name = "image-proxy-pvc"
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "5Gi"
      }
    }
    storage_class_name = "do-block-storage"
  }
}

resource "kubernetes_service" "image-proxy" {
  metadata {
    name = "image-proxy"
  }

  spec {
    selector = {
      app = "image-proxy"
    }

    port {
      name = "http"
      port = 8080
      target_port = 8080
    }
  }
}

resource "kubernetes_deployment" "image-quality-api" {
  metadata {
    name = "image-quality-api"
  }
  spec {
    selector {
      match_labels = {
        app = "image-quality-api"
      }
    }
    template {
      metadata {
        labels = {
          app = "image-quality-api"
        }
      }
      spec {
        node_selector = {
          "doks.digitalocean.com/node-pool" = "dish-worker-pool"
        }
        image_pull_secrets {
          name = "docker-config-json"
        }

        container {
          name  = "image-quality-api"
          image = "docker.k8s.dishapp.com/dish/image-quality-server"
          resources {
            limits {
              cpu    = "2"
              memory = "2Gi"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "image-quality-api" {
  metadata {
    name = "image-quality-api"
  }

  spec {
    selector = {
      app = "image-quality-api"
    }

    port {
      name = "http"
      port = 5005
      target_port = 5005
    }
  }
}


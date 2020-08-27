resource "kubernetes_deployment" "absa" {
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
        image_pull_secrets {
          name = "docker-config-json"
        }
        container {
          name  = "app"
          image = "docker.k8s.dishapp.com/dish/absa"
          port {
            container_port = 5000
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
      target_port = 5000
    }
  }
}


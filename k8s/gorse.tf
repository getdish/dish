resource "kubernetes_deployment" "gorse" {
  metadata {
    name = "gorse"
  }
  spec {
    selector {
      match_labels = {
        app = "gorse"
      }
    }
    strategy {
      type = "Recreate"
    }
    template {
      metadata {
        labels = {
          app = "gorse"
        }
      }
      spec {
        image_pull_secrets {
          name = "docker-config-json"
        }
        container {
          name  = "app"
          image = "docker.k8s.dishapp.com/dish/gorse"
          port {
            container_port = 9000
          }
          volume_mount {
            name = "gorse-config"
            mount_path = "/app/config.toml"
            sub_path = "config.toml"
          }
          volume_mount {
            name = "data"
            mount_path = "/data"
          }
        }
        volume {
          name = "data"
          persistent_volume_claim {
            claim_name= "gorse-pvc"
          }
        }
        volume {
          name = "gorse-config"
          config_map {
            name = "gorse-config"
          }
        }
      }
    }
  }
}

resource "kubernetes_config_map" "gorse-config" {
  metadata {
    name = "gorse-config"
  }
  data = {
    "config.toml" = file("../services/gorse/config.prod.toml")
  }
}

resource "kubernetes_persistent_volume_claim" "gorse-pvc" {
  metadata {
    name = "gorse-pvc"
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "25Gi"
      }
    }
  }
}

resource "kubernetes_service" "gorse" {
  metadata {
    name = "gorse"
  }

  spec {
    selector = {
      app = "gorse"
    }

    port {
      name = "http"
      port = 9000
      target_port = 9000
    }
  }
}

resource "kubernetes_ingress" "gorse" {
  metadata {
    name = "gorse-ingress"
    annotations = {
      "kubernetes.io/ingress.class" = "nginx"
      "cert-manager.io/cluster-issuer": "letsencrypt-prod"
      "cert-manager.io/acme-challenge-type": "http01"
      "nginx.ingress.kubernetes.io/configuration-snippet": <<EOF
        limit_except GET HEAD {
          deny all;
        }
      EOF
    }
  }
  spec {
    tls {
      hosts = [
        "gorse.${var.dish_domain}",
      ]
      secret_name = "gorse-tls"
    }
    rule {
      host = "gorse.${var.dish_domain}"
      http {
        path {
          path = "/"
          backend {
            service_name = "gorse"
            service_port = "http"
          }
        }
      }
    }
  }
}


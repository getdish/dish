resource "kubernetes_deployment" "apple-authorize" {
  lifecycle {
    ignore_changes = [
      "spec[0].replicas"
    ]
  }

  metadata {
    name = "apple-authorize"
  }
  spec {
    selector {
      match_labels = {
        app = "apple-authorize"
      }
    }
    template {
      metadata {
        labels = {
          app = "apple-authorize"
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
          name  = "apple-authorize"
          image = "docker.k8s.dishapp.com/dish/apple-authorize"
        }
      }
    }
  }
}

resource "kubernetes_service" "apple-authorize" {
  metadata {
    name = "apple-authorize"
  }
  spec {
    selector = {
      app = "apple-authorize"
    }
    port {
      name = "http"
      port = 6155
      target_port = 6155
    }
  }
}

resource "kubernetes_ingress" "apple-authorize" {
  metadata {
    name = "apple-authorize-ingress"
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
        "apple-authorize.${var.dish_domain}",
      ]
      secret_name = "apple-authorize-tls"
    }
    rule {
      host = "apple-authorize.${var.dish_domain}"
      http {
        path {
          path = "/"
          backend {
            service_name = "apple-authorize"
            service_port = "http"
          }
        }
      }
    }
  }
}


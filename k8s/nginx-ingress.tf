resource "kubernetes_namespace" "nginx-ingress" {
  metadata {
    name = "nginx-ingress"
  }
}

# Nginx Ingress is the internal load balancer.
# Not to be confused with DO's external load balancer.
resource "helm_release" "nginx-ingress" {
  name      = "nginx-ingress"
  namespace = "nginx-ingress"
  repository = data.helm_repository.stable.metadata.0.name
  chart     = "stable/nginx-ingress"
  version = "1.41.2"

  values = [
    file("yaml/nginx-ingress.yaml")
  ]

  set {
    name = "controller.service.type"
    value = "LoadBalancer"
  }

  set {
    name = "controller.replicaCount"
    value = "2"
  }
}


resource "kubernetes_ingress" "k8s-services-ingress" {
  metadata {
    name = "k8s-services-ingress"
    annotations = {
      "kubernetes.io/ingress.class" = "nginx"
      "cert-manager.io/cluster-issuer": "letsencrypt-prod"
      "cert-manager.io/acme-challenge-type": "http01"
    }
  }
  spec {
    tls {
      hosts = [
        "*.${var.dish_domain}",
        "*.k8s.${var.dish_domain}",
        var.dish_domain
      ]
      secret_name = "k8s-services-tls"
    }
    rule {
      host = var.dish_domain
      http {
        path {
          path = "/"
          backend {
            service_name = "dish-app-web"
            service_port = "http"
          }
        }
      }
    }
    rule {
      host = "staging.${var.dish_domain}"
      http {
        path {
          path = "/"
          backend {
            service_name = "web-staging"
            service_port = "http"
          }
        }
      }
    }
    rule {
      host = "hasura.${var.dish_domain}"
      http {
        path {
          path = "/"
          backend {
            service_name = "hasura"
            service_port = "http"
          }
        }
      }
    }
    rule {
      host = "search.${var.dish_domain}"
      http {
        path {
          path = "/"
          backend {
            service_name = "search"
            service_port = "http"
          }
        }
      }
    }
    rule {
      host = "auth.${var.dish_domain}"
      http {
        path {
          path = "/"
          backend {
            service_name = "jwt-server"
            service_port = "http"
          }
        }
      }
    }
    rule {
      host = "worker-ui.k8s.${var.dish_domain}"
      http {
        path {
          path = "/"
          backend {
            service_name = "worker-ui"
            service_port = "http"
          }
        }
      }
    }
    rule {
      host = "images.${var.dish_domain}"
      http {
        path {
          path = "/"
          backend {
            service_name = "image-proxy"
            service_port = "http"
          }
        }
      }
    }
    rule {
      host = "image-quality.k8s.${var.dish_domain}"
      http {
        path {
          path = "/"
          backend {
            service_name = "image-quality-api"
            service_port = "http"
          }
        }
      }
    }
    rule {
      host = "bert.k8s.${var.dish_domain}"
      http {
        path {
          path = "/"
          backend {
            service_name = "bert"
            service_port = "http"
          }
        }
      }
    }
  }
}

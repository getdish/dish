resource "kubernetes_namespace" "docker" {
  metadata {
    name = "docker"
  }
}

resource "helm_release" "docker-registry" {
  name = "docker-registry"
  namespace = "docker"
  chart = "stable/docker-registry"
  version = "1.9.4"

  values = [
    file("yaml/docker-registry.yaml")
  ]

  set {
    name = "persistence.enabled"
    value = true
  }

  set {
    name = "persistence.deleteEnabled"
    value = true
  }

  set {
    name = "persistence.size"
    value = "50Gi"
  }
}

resource "kubernetes_secret" "docker-registry-auth" {
  metadata {
    name      = "docker-registry-auth"
    namespace = "docker"
  }

  data = {
    "auth" = var.DOCKER_REGISTRY_HTTP_AUTH
  }

  type = "Opaque"
}

resource "kubernetes_ingress" "docker-registry-ingress" {
  metadata {
    name = "docker-registry-ingress"
    namespace = "docker"
    annotations = {
      "kubernetes.io/ingress.class" = "nginx"
      "cert-manager.io/cluster-issuer": "letsencrypt-prod"
      "cert-manager.io/acme-challenge-type": "http01"
      "nginx.ingress.kubernetes.io/auth-type": "basic"
      "nginx.ingress.kubernetes.io/auth-secret": "docker-registry-auth"
      "nginx.ingress.kubernetes.io/auth-realm": "Authentication Required"
      "nginx.ingress.kubernetes.io/proxy-body-size": "0" # Docker images have large bodies
    }
  }
  spec {
    tls {
      hosts = [
        "docker.k8s.${var.dish_domain}",
      ]
      secret_name = "docker-tls"
    }
    backend {
      service_name = "docker-registry"
      service_port = 5000
    }
    rule {
      host = "docker.k8s.${var.dish_domain}"
      http {
        path {
          path = "/*"
          backend {
            service_name = "docker-registry"
            service_port = 5000
          }
        }
      }
    }
  }
}

resource "kubernetes_secret" "docker-config-json" {
  metadata {
    name = "docker-config-json"
  }

  data = {
    ".dockerconfigjson" = var.DOCKER_CONFIG_JSON
  }

  type = "kubernetes.io/dockerconfigjson"
}

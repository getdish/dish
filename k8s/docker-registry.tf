resource "kubernetes_namespace" "docker-registry" {
  metadata {
    name = "docker-registry"
  }
}

resource "helm_release" "docker-registry" {
  name = "docker-registry"
  namespace = "docker-registry"
  chart = "stable/docker-registry"
  version = "1.9.3"

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
    value = "25Gi"
  }
}

resource "kubernetes_secret" "docker-registry-auth" {
  metadata {
    name      = "docker-registry-auth"
    namespace = "docker-registry"
  }

  data = {
    "auth" = var.DOCKER_REGISTRY_HTTP_AUTH
  }

  type = "Opaque"
}

resource "kubernetes_ingress" "docker-registry-ingress" {
  metadata {
    name = "docker-registry-ingress"
    namespace = "docker-registry"
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

# Role permissions for Docker Registry management
resource "kubernetes_role" "docker_registry_role" {
  metadata {
    name = "docker_registry_role"
    namespace = "docker-registry"
  }

  rule {
    api_groups = [""]
    resources  = ["pods/exec"]
    verbs      = ["create"]
  }

  rule {
    api_groups = [""]
    resources  = ["pods"]
    verbs      = ["get", "list"]
  }
}

resource "kubernetes_role_binding" "docker_registry_binding" {
  metadata {
    name = "docker_registry_binding"
    namespace = "docker-registry"
  }

  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "Role"
    name      = "docker_registry_role"
  }

  subject {
    api_group = ""
    kind = "ServiceAccount"
    name = "ci"
  }
}

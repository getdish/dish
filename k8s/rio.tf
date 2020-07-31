resource "kubernetes_namespace" "rio" {
  metadata {
    name = "rio-system"
  }

  lifecycle {
    ignore_changes = [
      metadata[0].annotations,
      metadata[0].labels
    ]
  }
}

data "local_file" "rio-yaml" {
  filename = "${path.module}/yaml/rio.yaml"
}

data "local_file" "rio-custom-domain" {
  filename = "${path.module}/yaml/rio-custom-domain.yaml"
}

data "local_file" "rio-app-domains" {
  filename = "${path.module}/yaml/rio-app-domains.yaml"
}

resource "null_resource" "rio-setup" {
  depends_on = [helm_release.cert-manager]

  triggers = {
    manifest_sha1 = sha1(data.local_file.rio-yaml.content)
  }

  provisioner "local-exec" {
    command = <<EOC
echo "Applying Rio YAML (to install Rio) ..."

kubectl apply -f ${data.local_file.rio-yaml.filename}

echo "Rio YAML applied"
EOC
  }
}

resource "null_resource" "rio-custom-domain" {
  depends_on = [null_resource.rio-setup]

  triggers = {
    manifest_sha1 = sha1(data.local_file.rio-custom-domain.content)
  }

  provisioner "local-exec" {
    command = <<EOC
echo "Applying Rio custom domain YAML..."

kubectl apply -f ${data.local_file.rio-custom-domain.filename}

echo "Rio custom domain YAML applied"
EOC
  }
}


resource "null_resource" "rio-app-domains" {
  depends_on = [null_resource.rio-setup]

  triggers = {
    manifest_sha1 = sha1(data.local_file.rio-app-domains.content)
  }

  provisioner "local-exec" {
    command = <<EOC
echo "Applying Rio app domains YAML..."

kubectl apply -f ${data.local_file.rio-app-domains.filename}

echo "Rio app domains YAML applied"
EOC
  }
}

resource "kubernetes_ingress" "rio-ingress" {
  depends_on = [helm_release.cert-manager]

  metadata {
    name = "rio-ingress"
    namespace = "rio-system"
    annotations = {
      "kubernetes.io/ingress.class" = "nginx"
      "cert-manager.io/cluster-issuer": "letsencrypt-prod"
      "cert-manager.io/acme-challenge-type": "dns01"
      "nginx.org/websocket-services": "gateway-proxy"
    }
  }
  spec {
    tls {
      hosts = [
        "*.rio.${var.dish_domain}",
        var.dish_domain
      ]
      secret_name = "rio-tls"
    }
    backend {
      service_name = "gateway-proxy"
      service_port = 80
    }
    rule {
      host = "*.rio.${var.dish_domain}"
      http {
        path {
          path = "/*"
          backend {
            service_name = "gateway-proxy"
            service_port = 80
          }
        }
      }
    }
    rule {
      host = var.dish_domain
      http {
        path {
          path = "/*"
          backend {
            service_name = "gateway-proxy"
            service_port = 80
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

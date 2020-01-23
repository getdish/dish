resource "kubernetes_namespace" "rio" {
  metadata {
    name = "rio-system"
  }
}

data "local_file" "rio-yaml" {
  filename = "${path.module}/yaml/rio.yaml"
}

data "local_file" "rio-custom-domain" {
  filename = "${path.module}/yaml/rio-custom-domain.yaml"
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

resource "kubernetes_ingress" "rio-ingress" {
  depends_on = [helm_release.cert-manager]

  metadata {
    name = "rio-ingress"
    namespace = "rio-system"
    annotations = {
      "kubernetes.io/ingress.class" = "nginx"
      "cert-manager.io/cluster-issuer": "letsencrypt-prod"
      "cert-manager.io/acme-challenge-type": "dns01"
    }
  }
  spec {
    tls {
      hosts = [
        "*.rio.${var.dish_domain}",
      ]
      secret_name = "rio-wildcard-tls"
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
  }
}

# ---
# Lets Encrypt for automated management of SSL certs
# ---

variable "cert_manager_version" {
  default = "0.15"
}

data "local_file" "cert_manager_setup" {
  filename = "${path.module}/yaml/cert-manager.yaml"
}

data "helm_repository" "jetstack" {
  name = "jetstack"
  url  = "https://charts.jetstack.io"
}

resource "helm_release" "cert-manager" {
  name      = "cert-manager"
  namespace = "cert-manager"
  repository = data.helm_repository.jetstack.metadata.0.name
  chart     = "jetstack/cert-manager"
  version = "v${var.cert_manager_version}.0"

  set {
    name = "installCRDs"
    value = true
  }
}

resource "null_resource" "cert-manager-setup" {
  depends_on = [helm_release.cert-manager]

  triggers = {
    manifest_sha1 = sha1(data.local_file.cert_manager_setup.content)
  }

  provisioner "local-exec" {
    command = <<EOC
echo "Applying custom YAML for Cert Manager..."

kubectl apply -f ${data.local_file.cert_manager_setup.filename}

echo "Custom Cert Manager YAML applied"
EOC
  }
}

resource "kubernetes_secret" "cloudflare-dns-api-token" {
  depends_on = [helm_release.cert-manager]
  metadata {
    name      = "cloudflare-dns-api-token"
    namespace = "cert-manager"
  }

  data = {
    "api-token" = var.CLOUDFLARE_DNS_API_TOKEN
  }

  type = "Opaque"
}

variable "DO_DISH_KEY" {}
variable "DO_SPACES_ID" {}
variable "DO_SPACES_SECRET" {}
variable "POSTGRES_PASSWORD" {}
variable "DOCKER_REGISTRY_HTTP_AUTH" {}
variable "DOCKER_CONFIG_JSON" {}
variable "GRAFANA_PASSWORD" {}
variable "CLOUDFLARE_DNS_API_TOKEN" {}
variable "GMAIL_APP_PASSWORD" {}
variable "K8S_DSN" {}

# Keeping the cluster in its own module allows us to build it independently of
# every other k8s resources that lives on it. This is essential when first
# running `terraform apply`.
module "cluster" {
  DO_DISH_KEY = var.DO_DISH_KEY
  source = "./cluster"
}

variable "dish_domain" {
  default = "dishapp.com"
}

data "helm_repository" "stable" {
  name = "stable"
  url  = "https://kubernetes-charts.storage.googleapis.com/"
}

data "helm_repository" "incubator" {
  name = "incubator"
  url  = "https://kubernetes-charts-incubator.storage.googleapis.com/"
}

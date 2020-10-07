variable "DO_DISH_KEY" {}
variable "DO_SPACES_ID" {}
variable "DO_SPACES_SECRET" {}
variable "POSTGRES_HOST" {}
variable "POSTGRES_PASSWORD" {}
variable "HASURA_GRAPHQL_ADMIN_SECRET" {}
variable "HASURA_ENDPOINT" {}
variable "DOCKER_REGISTRY_HTTP_AUTH" {}
variable "DOCKER_CONFIG_JSON" {}
variable "JWT_KEY" {}
variable "JWT_ADMIN_PASSWORD" {}
variable "GRAFANA_PASSWORD" {}
variable "CLOUDFLARE_DNS_API_TOKEN" {}
variable "GMAIL_APP_PASSWORD" {}
variable "K8S_DSN" {}
variable "TIMESCALE_HOST" {}
variable "TIMESCALE_SU_PASS" {}
variable "TIMESCALE_REPLICATION_PASS" {}
variable "TIMESCALE_ADMIN_PASS" {}
variable "SENTRY_PG_PASS" {}
variable "SENTRY_USER_PASS" {}
variable "POSTGRES_REPMGR_PASSWORD" {}
variable "HEREMAPS_API_TOKEN" {}
variable "CURRENT_DISH_CLUSTER" {}

variable "UBEREATS_PROXY" {}
variable "YELP_AWS_PROXY" {}
variable "INFATUATED_PROXY" {}
variable "MICHELIN_PROXY" {}
variable "TRIPADVISOR_PROXY" {}
variable "GOOGLE_AWS_PROXY" {}
variable "GOOGLE_SEARCH_PROXY" {}
variable "GOOGLE_USERCONTENT_AWS_PROXY" {}
variable "DOORDASH_GRAPHQL_AWS_PROXY" {}
variable "GRUBHUB_AWS_PROXY" {}
variable "YELP_CDN_AWS_PROXY" {}
variable "LUMINATI_PROXY_HOST" {}
variable "LUMINATI_PROXY_PORT" {}
variable "LUMINATI_PROXY_DATACENTRE_USER" {}
variable "LUMINATI_PROXY_DATACENTRE_PASSWORD" {}
variable "LUMINATI_PROXY_RESIDENTIAL_USER" {}
variable "LUMINATI_PROXY_RESIDENTIAL_PASSWORD" {}
variable "GPT3_KEY" {}

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

data "helm_repository" "bitnami" {
  name = "bitnami"
  url  = "https://charts.bitnami.com/bitnami"
}

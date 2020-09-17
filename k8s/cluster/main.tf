variable DO_DISH_KEY {}

# The `digitalocean` provider is a third-party Terraform plugin. It needs an
# API key to talk to the Digital Ocean platform
provider "digitalocean" {
  token = var.DO_DISH_KEY
}

# The main definition of the Kubernetes cluster
# !! Changing some of these can delete and recreate the entire cluster without warning !!
# !! And by 'cluster' I mean EVERYTHING, PVCs, data, EVERYTHING !!
resource "digitalocean_kubernetes_cluster" "dish" {
  name    = "dish-blue"
  region  = "sfo2"
  version = "1.18.6-do.0"

  node_pool {
    name       = "dish-k8s-pool"
    size       = "g-2vcpu-8gb"
    auto_scale = true
    min_nodes = 1
    max_nodes = 3
  }
}


// kubectl taint node dish-critical-pool-3wupi dish-taint=critical-only:NoSchedule
// kubectl taint node dish-db-pool-3wyiq dish-taint=db-only:NoSchedule

resource "digitalocean_kubernetes_node_pool" "db" {
  cluster_id = digitalocean_kubernetes_cluster.dish.id
  name       = "dish-db-pool"
  size       = "g-2vcpu-8gb"
  auto_scale = true
  min_nodes = 3
  max_nodes = 5
}

resource "digitalocean_kubernetes_node_pool" "critical" {
  cluster_id = digitalocean_kubernetes_cluster.dish.id
  name       = "dish-critical-pool"
  size       = "g-2vcpu-8gb"
  auto_scale = true
  min_nodes = 1
  max_nodes = 5
}

resource "digitalocean_kubernetes_node_pool" "ancillary" {
  cluster_id = digitalocean_kubernetes_cluster.dish.id
  name       = "dish-ancillary-pool"
  size       = "s-6vcpu-16gb"
  auto_scale = true
  min_nodes = 1
  max_nodes = 10
}

resource "digitalocean_kubernetes_node_pool" "workers" {
  cluster_id = digitalocean_kubernetes_cluster.dish.id
  name       = "dish-worker-pool"
  size       = "s-6vcpu-16gb"
  auto_scale = true
  min_nodes = 1
  max_nodes = 10
}

resource "digitalocean_kubernetes_node_pool" "ci" {
  cluster_id = digitalocean_kubernetes_cluster.dish.id
  name       = "dish-ci-pool"
  size       = "s-6vcpu-16gb"
  node_count = 1
}

# Once the cluster is created, all other Terraform commands will reference the cluster
# by its ID.
output "cluster-id" {
  value = digitalocean_kubernetes_cluster.dish.id
}

# The `kubernetes` provider is a third-party Terraform plugin. It knows nothing about
# the company that provides the underlying compute resources. It talks only to a k8s API.
provider "kubernetes" {
  host = digitalocean_kubernetes_cluster.dish.endpoint
  token = digitalocean_kubernetes_cluster.dish.kube_config[0].token
}

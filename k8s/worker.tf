resource "kubernetes_deployment" "worker" {
  metadata {
    name = "worker"
  }
  spec {
    selector {
      match_labels = {
        app = "worker"
      }
    }
    template {
      metadata {
        labels = {
          app = "worker"
        }
      }
      spec {
        node_selector = {
          "doks.digitalocean.com/node-pool" = "dish-worker-pool"
        }

        image_pull_secrets {
          name = "docker-config-json"
        }

        container {
          name  = "worker"
          image = "docker.k8s.dishapp.com/dish/worker"
          resources {
            limits {
              cpu    = "1"
              memory = "2Gi"
            }
          }
          env {
            name = "DISH_ENV"
            value = "production"
          }
          env {
            name = "HASURA_ENDPOINT"
            value = var.HASURA_ENDPOINT
          }
          env {
            name = "REDIS_HOST"
            value = "redis-master.redis"
          }
          env {
            name = "PGHOST"
            value = var.POSTGRES_HOST
          }
          env {
            name = "PGPASSWORD"
            value = var.POSTGRES_PASSWORD
          }
          env {
            name = "HASURA_SECRET"
            value = var.HASURA_GRAPHQL_ADMIN_SECRET
          }
          env {
            name = "TIMESCALE_HOST"
            value = var.TIMESCALE_HOST
          }
          env {
            name = "TIMESCALE_PASSWORD"
            value = var.TIMESCALE_SU_PASS
          }
          env {
            name = "TIMESCALE_PORT"
            value = "5432"
          }
          env {
            name = "UBEREATS_PROXY"
            value = var.UBEREATS_PROXY
          }
          env {
            name = "HEREMAPS_API_TOKEN"
            value = var.HEREMAPS_API_TOKEN
          }
          env {
            name = "INFATUATED_PROXY"
            value = var.INFATUATED_PROXY
          }
          env {
            name = "MICHELIN_PROXY"
            value = var.MICHELIN_PROXY
          }
          env {
            name = "YELP_AWS_PROXY"
            value = var.YELP_AWS_PROXY
          }
          env {
            name = "TRIPADVISOR_PROXY"
            value = var.TRIPADVISOR_PROXY
          }
          env {
            name = "GOOGLE_SEARCH_PROXY"
            value = var.GOOGLE_SEARCH_PROXY
          }
          env {
            name = "GOOGLE_AWS_PROXY"
            value = var.GOOGLE_AWS_PROXY
          }
          env {
            name = "GOOGLE_USERCONTENT_AWS_PROXY"
            value = var.GOOGLE_USERCONTENT_AWS_PROXY
          }
          env {
            name = "DOORDASH_GRAPHQL_AWS_PROXY"
            value = var.DOORDASH_GRAPHQL_AWS_PROXY
          }
          env {
            name = "GRUBHUB_AWS_PROXY"
            value = var.GRUBHUB_AWS_PROXY
          }
          env {
            name = "YELP_CDN_AWS_PROXY"
            value = var.MICHELIN_PROXY
          }
          env {
            name = "LUMINATI_PROXY_HOST"
            value = var.LUMINATI_PROXY_HOST
          }
          env {
            name = "LUMINATI_PROXY_PORT"
            value = var.LUMINATI_PROXY_PORT
          }
          env {
            name = "LUMINATI_PROXY_DATACENTRE_USER"
            value = var.LUMINATI_PROXY_DATACENTRE_USER
          }
          env {
            name = "LUMINATI_PROXY_DATACENTRE_PASSWORD"
            value = var.LUMINATI_PROXY_DATACENTRE_PASSWORD
          }
          env {
            name = "LUMINATI_PROXY_RESIDENTIAL_USER"
            value = var.LUMINATI_PROXY_RESIDENTIAL_USER
          }
          env {
            name = "LUMINATI_PROXY_RESIDENTIAL_PASSWORD"
            value = var.LUMINATI_PROXY_RESIDENTIAL_PASSWORD
          }
          env {
            name = "DO_SPACES_ID"
            value = var.DO_SPACES_ID
          }
          env {
            name = "DO_SPACES_SECRET"
            value = var.DO_SPACES_SECRET
          }
          env {
            name = "NODE_OPTIONS"
            value = "--max_old_space_size=4096"
          }
        }
      }
    }
  }
}

resource "kubernetes_deployment" "worker-ui" {
  metadata {
    name = "worker-ui"
  }
  spec {
    selector {
      match_labels = {
        app = "worker-ui"
      }
    }
    template {
      metadata {
        labels = {
          app = "worker-ui"
        }
      }
      spec {
        node_selector = {
          "doks.digitalocean.com/node-pool" = "dish-ancillary-pool"
        }

        container {
          name  = "worker-ui"
          image = "tombh/bull-board:latest"
          env {
            name = "REDIS_HOST"
            value = "redis-master.redis"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "worker-ui" {
  metadata {
    name = "worker-ui"
  }

  spec {
    selector = {
      app = "worker-ui"
    }

    port {
      name = "http"
      port = 3000
      target_port = 3000
    }
  }
}




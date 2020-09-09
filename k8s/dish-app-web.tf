resource "kubernetes_deployment" "dish-app-web" {
  lifecycle {
    ignore_changes = [
      "spec[0].replicas"
    ]
  }
  metadata {
    name = "dish-app-web"
  }
  spec {
    selector {
      match_labels = {
        app = "dish-app-web"
      }
    }
    template {
      metadata {
        labels = {
          app = "dish-app-web"
        }
      }
      spec {
        node_selector = {
          "doks.digitalocean.com/node-pool" = "dish-critical-pool"
        }

        image_pull_secrets {
          name = "docker-config-json"
        }

        toleration {
          key = "dish-taint"
          operator = "Equal"
          value = "critical-only"
          effect = "NoSchedule"
        }


        container {
          name  = "dish-app-web"
          image = "docker.k8s.dishapp.com/dish/app"
          env {
            name = "DISH_ENV"
            value = "production"
          }
          env {
            name = "HASURA_ENDPOINT"
            value = var.HASURA_ENDPOINT
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "dish-app-web" {
  metadata {
    name = "dish-app-web"
  }

  spec {
    selector = {
      app = "dish-app-web"
    }

    port {
      name = "http"
      port = 19006
      target_port = 19006
    }
  }
}

variable "staging_sha256" {
  default = "4b67a1b34291384ad7050aac4d569ad65682ddca0be11b933056532e35f7b3bd"
}

resource "kubernetes_deployment" "web-staging" {
  lifecycle {
    ignore_changes = [
      "spec[0].replicas"
    ]
  }
  metadata {
    name = "web-staging"
  }
  spec {
    selector {
      match_labels = {
        app = "web-staging"
      }
    }
    template {
      metadata {
        labels = {
          app = "web-staging"
        }
      }
      spec {
        node_selector = {
          "doks.digitalocean.com/node-pool" = "dish-critical-pool"
        }

        image_pull_secrets {
          name = "docker-config-json"
        }

        toleration {
          key = "dish-taint"
          operator = "Equal"
          value = "critical-only"
          effect = "NoSchedule"
        }


        container {
          name  = "web-staging"
          image = "docker.k8s.dishapp.com/dish/app@sha256:${var.staging_sha256}"
          env {
            name = "DISH_ENV"
            value = "production"
          }
          env {
            name = "HASURA_ENDPOINT"
            value = var.HASURA_ENDPOINT
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "web-staging" {
  metadata {
    name = "web-staging"
  }

  spec {
    selector = {
      app = "web-staging"
    }

    port {
      name = "http"
      port = 19006
      target_port = 19006
    }
  }
}

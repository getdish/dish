resource "kubernetes_deployment" "cron" {
  metadata {
    name = "cron"
  }
  spec {
    selector {
      match_labels = {
        app = "cron"
      }
    }
    template {
      metadata {
        labels = {
          app = "cron"
        }
      }
      spec {
        image_pull_secrets {
          name = "docker-config-json"
        }
        container {
          name  = "app"
          image = "docker.k8s.dishapp.com/dish/cron"

          env {
            name = "TF_VAR_DO_DISH_KEY"
            value = var.DO_DISH_KEY
          }
          env {
            name = "TF_VAR_CURRENT_DISH_CLUSTER"
            value = var.CURRENT_DISH_CLUSTER
          }
          env {
            name = "TF_VAR_POSTGRES_PASSWORD"
            value = var.POSTGRES_PASSWORD
          }
          env {
            name = "TF_VAR_POSTGRES_HOST"
            value = var.POSTGRES_HOST
          }
          env {
            name = "TF_VAR_TIMESCALE_SU_PASS"
            value = var.TIMESCALE_SU_PASS
          }
          env {
            name = "TF_VAR_TIMESCALE_HOST"
            value = var.TIMESCALE_HOST
          }
          env {
            name = "TF_VAR_DO_SPACES_ID"
            value = var.DO_SPACES_ID
          }
          env {
            name = "TF_VAR_DO_SPACES_SECRET"
            value = var.DO_SPACES_SECRET
          }
          env {
            name = "GRAFANA_API_KEY"
            value = var.GRAFANA_API_KEY
          }
        }
      }
    }
  }
}


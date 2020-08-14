resource "kubernetes_deployment" "hasura" {
  lifecycle {
    ignore_changes = [
      "spec[0].replicas"
    ]
  }
  metadata {
    name = "hasura"
  }
  spec {
    selector {
      match_labels = {
        app = "hasura"
      }
    }
    template {
      metadata {
        labels = {
          app = "hasura"
        }
      }
      spec {
        node_selector = {
          "doks.digitalocean.com/node-pool" = "dish-critical-pool"
        }

        toleration {
          key = "dish-taint"
          operator = "Equal"
          value = "critical-only"
          effect = "NoSchedule"
        }

        container {
          name  = "hasura"
          image = "hasura/graphql-engine:v1.2.2"

          env {
            name = "HASURA_GRAPHQL_DATABASE_URL"
            value = "postgres://postgres:${var.POSTGRES_PASSWORD}@${var.POSTGRES_HOST}/dish"
          }
          env {
            name = "HASURA_GRAPHQL_ENABLE_CONSOLE"
            value = "true"
          }
          env {
            name = "HASURA_GRAPHQL_ENABLED_LOG_TYPES"
            value = "startup, http-log, webhook-log, websocket-log, query-log"
          }
          env {
            name = "HASURA_GRAPHQL_ENABLE_TELEMETRY"
            value = "false"
          }
          env {
            name = "HASURA_GRAPHQL_UNAUTHORIZED_ROLE"
            value = "anon"
          }
          env {
            name = "HASURA_GRAPHQL_ADMIN_SECRET"
            value = var.HASURA_GRAPHQL_ADMIN_SECRET
          }
          env {
            name = "DISH_HOOKS_ENDPOINT"
            value = "http://dish-hooks:6154"
          }

          command = [
            "graphql-engine", "serve",
            "--jwt-secret", "{\"type\":\"HS256\", \"key\":\"${var.JWT_KEY}\"}"
          ]
        }
      }
    }
  }
}

resource "kubernetes_service" "hasura" {
  metadata {
    name = "hasura"
  }

  spec {
    selector = {
      app = "hasura"
    }

    port {
      name = "http"
      port = 8080
      target_port = 8080
    }
  }
}


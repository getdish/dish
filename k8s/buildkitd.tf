resource "kubernetes_deployment" "buildkitd" {
  metadata {
    name = "buildkitd"
    namespace = "docker-registry"
  }
  spec {
    selector {
      match_labels = {
        app = "buildkitd"
      }
    }
    template {
      metadata {
        labels = {
          app = "buildkitd"
        }
      }
      spec {
        container {
          name  = "buildkitd"
          image = "moby/buildkit:master"
          env {
            name = "DOCKER_CONFIG"
            value = "/app"
          }

          args = [
            "--addr", "unix:///run/buildkit/buildkitd.sock",
            "--addr", "tcp://0.0.0.0:1234",
          ]

          port {
            container_port = 1234
          }

          liveness_probe {
            exec {
              command = [
                "buildctl", "debug", "workers"
              ]
            }
            initial_delay_seconds = 5
            period_seconds    = 30
          }

          readiness_probe {
            exec {
              command = [
                "buildctl", "debug", "workers"
              ]
            }
            initial_delay_seconds = 5
            period_seconds    = 30
          }

          security_context {
            privileged = true
          }

          volume_mount {
            name = "buildkitd-config"
            mount_path = "/app/config.json"
            sub_path = "config.json"
          }
        }

        volume {
          name = "buildkitd-config"
          config_map {
            name = "buildkitd-config"
          }
        }
      }
    }
  }
}

resource "kubernetes_config_map" "buildkitd-config" {
  metadata {
    name = "buildkitd-config"
    namespace = "docker-registry"
  }
  data = {
    "config.json" = var.DOCKER_CONFIG_JSON
  }
}

resource "kubernetes_service" "buildkitd" {
  metadata {
    name = "buildkitd"
    namespace = "docker-registry"
  }

  spec {
    selector = {
      app = "buildkitd"
    }

    port {
      name = "http"
      port = 1234
      target_port = 1234
    }
  }
}

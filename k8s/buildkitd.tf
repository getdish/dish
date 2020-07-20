resource "kubernetes_deployment" "buildkitd" {
  metadata {
    name = "buildkitd"
    namespace = "docker"
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
        node_selector = {
          "doks.digitalocean.com/node-pool" = "dish-ci-pool"
        }

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
            "--tlscacert", "/certs/ca.pem",
            "--tlscert", "/certs/cert.pem",
            "--tlskey", "/certs/key.pem"
          ]

          port {
            container_port = 1234
          }

          resources {
            limits {
              cpu    = "5"
              memory = "12Gi"
            }
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

          volume_mount {
            name = "buildkitd-certs"
            read_only = true
            mount_path = "/certs"
          }
        }

        volume {
          name = "buildkitd-config"
          config_map {
            name = "buildkitd-config"
          }
        }

        volume {
          name = "buildkitd-certs"
          secret {
            secret_name = "buildkitd-certs"
          }
        }
      }
    }
  }
}

resource "kubernetes_config_map" "buildkitd-config" {
  metadata {
    name = "buildkitd-config"
    namespace = "docker"
  }
  data = {
    "config.json" = var.DOCKER_CONFIG_JSON
  }
}

resource "kubernetes_secret" "buildkitd-certs" {
  metadata {
    name      = "buildkitd-certs"
    namespace = "docker"
  }

  data = {
   "ca.pem" = file("etc/certs/buildkit/daemon/ca.pem")
   "cert.pem" = file("etc/certs/buildkit/daemon/cert.pem")
   "key.pem" = file("etc/certs/buildkit/daemon/key.pem")
  }

  type = "generic"
}

resource "kubernetes_service" "buildkitd" {
  metadata {
    name = "buildkitd"
    namespace = "docker"
  }

  spec {
    selector = {
      app = "buildkitd"
    }

    port {
      name = "tcp"
      port = 1234
      target_port = 1234
    }
  }
}

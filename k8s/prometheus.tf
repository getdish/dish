# Prometheus is currently the defacto monitoring solution for Kubernetes.
# This chart also installs Grafana for viewing the monitoring data in graphs
# and on dashboards.
# And there's also an alert manager here to generate various kinds of alerts.

resource "helm_release" "prometheus-operator" {
  name = "prometheus-operator"
  namespace = "monitoring"
  chart = "stable/prometheus-operator"
  version = "8.13.12"

  values = [
    file("yaml/prometheus.yaml")
  ]

  set {
    name = "grafana.adminPassword"
    value = var.GRAFANA_PASSWORD
  }
}

resource "kubernetes_ingress" "grafana-ingress" {
  metadata {
    name = "grafana-ingress"
    namespace = "monitoring"
    annotations = {
      "kubernetes.io/ingress.class" = "nginx"
      "cert-manager.io/cluster-issuer": "letsencrypt-prod"
      "cert-manager.io/acme-challenge-type": "http01"
    }
  }
  spec {
    tls {
      hosts = [
        "grafana.k8s.${var.dish_domain}",
      ]
      secret_name = "grafana-tls"
    }
    backend {
      service_name = "prometheus-operator-grafana"
      service_port = 80
    }
    rule {
      host = "grafana.k8s.${var.dish_domain}"
      http {
        path {
          path = "/*"
          backend {
            service_name = "prometheus-operator-grafana"
            service_port = 80
          }
        }
      }
    }
  }
}

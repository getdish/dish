# Prometheus is currently the defacto monitoring solution for Kubernetes.
# This chart also installs Grafana for viewing the monitoring data in graphs
# and on dashboards.
# And there's also an alert manager here to generate various kinds of alerts.

# Both these versions should be changed at the same time
variable "prometheus_version" {
  default = "8.5.12"
}
variable "prometheus_commit" {
  default = "c0bd025047cd44d09a1296471ebe1c262395f6fc"
}

# Theoretically Helm should be installing these, but for some reason it doesn't
resource "null_resource" "prometheus-crd" {
  triggers = {
    version = var.prometheus_version
  }

  provisioner "local-exec" {
    command = <<EOC
echo "Applying CRDs for Prometheus"

base=https://raw.githubusercontent.com/helm/charts/${var.prometheus_commit}/stable/prometheus-operator/crds/

kubectl apply -f $base/crd-alertmanager.yaml
kubectl apply -f $base/crd-podmonitor.yaml
kubectl apply -f $base/crd-prometheus.yaml
kubectl apply -f $base/crd-prometheusrules.yaml
kubectl apply -f $base/crd-servicemonitor.yaml

echo "CRDs applied"
EOC
  }
}

resource "helm_release" "prometheus-operator" {
  depends_on = [null_resource.prometheus-crd]

  name = "prometheus-operator"
  namespace = "monitoring"
  chart = "stable/prometheus-operator"
  version = var.prometheus_version

  values = [
    file("yaml/prometheus.yaml")
  ]

  set {
    name = "prometheusOperator.createCustomResource"
    value = false
  }

  set {
    name = "grafana.adminPassword"
    value = var.GRAFANA_PASSWORD
  }
}


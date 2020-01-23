# Kubernetes

Our Kubernetes (k8s) is managed by Terraform, an Infrastructure as Code framework. This
means that all changes to the cluster architecture and state can be tracked in Git. Some
changes such as autoscaling changes are obviously not tracked.

## Getting started
### Prerequisites
All of these should be installable through your OS's standard package manager (Snaps, PPAs).
However, most of these also have oneliner `curl` commands to install simple static binaries.

  * [`doctl`](https://github.com/digitalocean/doctl): Talking to the Digital Ocean API. 
  * [`kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/): Talking to the Kubernetes API. 
  * [Terraform](https://learn.hashicorp.com/terraform/getting-started/install.html): Infrastructure As Code. Talking to the k8s API.
  * [Helm](https://v3.helm.sh/docs/intro/install/) (v2.5.1): Kubernetes package manager.

### Authorizing `doctl`
Token is avaiable in `secrets.enc.tf`
`doctl auth init -t $DIGITAL_OCEAN_API_TOKEN`

### Creating the cluster for the first time
  * `terraform init` Connects to DO Spaces to save state. Downloads modules
  * `terraform apply -target=module.cluster` Just build the bare compute resources
  * `doctl kubernetes cluster kubeconfig save dish` Sets up `kubectl`
  *  `./etc/helm_fix.sh` Applies Helm (k8s package manager) fix.
  * `terraform apply` Adds all the remaining resources
  * `rio up --answers env.enc.production.yaml` Bring up the main Dish services using Rio

### Connecting to an existing cluster
  * `terraform init` Connects to DO Spaces to save state. Downloads modules
  * `doctl kubernetes cluster kubeconfig save dish` Sets up `kubectl`

#### Load Balancer IP
A platform-specific load balancer will be created outside the Kubernetes cluster. On DO it
doesn't currently seem possible to associate a specific IP address. So you will need to look
at the DO UI under Networking->Load Balancers to find the new IP address and assign it as an
A record to the appropriate domain.


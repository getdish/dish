terraform {
  required_providers {
    digitalocean = {
      source  = "terraform-providers/digitalocean"
      version = "~> 1.22"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 1.2.4"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 1.12.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 1.4"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 2.1.2"
    }
  }

  backend "s3" {
    bucket                      = "dish-etc"
    key                         = "dish-blue.tfstate"
    region                      = "us-east-1" // Hack to trick Terraform into using DO
    endpoint                    = "https://sfo2.digitaloceanspaces.com"
    skip_credentials_validation = true
    skip_metadata_api_check     = true
  }
}

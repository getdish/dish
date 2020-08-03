terraform {
  required_providers {
    digitalocean = "~> 1.22"
    helm = "~> 1.2.4"
    kubernetes = "~> 1.12.0"
    local = "~> 1.4"
    null = "~> 2.1.2"
  }

  backend "s3" {
    bucket = "dish-etc"
    key    = "dish-blue.tfstate"
    region = "us-east-1" // Hack to trick Terraform into using DO
    endpoint = "https://sfo2.digitaloceanspaces.com"
    skip_credentials_validation = true
    skip_metadata_api_check = true
  }
}

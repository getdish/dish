terraform {
  required_providers {
    digitalocean = "~> 1.12"
    helm = "~> 0.10"
    kubernetes = "~> 1.10"
    local = "~> 1.4"
    null = "~> 2.1"
  }

  backend "s3" {
    bucket = "dish-etc"
    key    = "terraform.tfstate"
    region = "us-east-1" // Hack to trick Terraform into using DO
    endpoint = "https://sfo2.digitaloceanspaces.com"
    skip_credentials_validation = true
    skip_metadata_api_check = true
  }
}

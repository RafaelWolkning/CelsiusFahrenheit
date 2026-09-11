# Terraform config to build and run the Docker container locally
# Usage: cd terraform && terraform init && terraform plan && terraform apply

terraform {
  required_version = ">= 1.0"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
}

resource "docker_image" "app" {
  name = "celsius-fahrenheit:latest"
  build {
    context    = ".."
    dockerfile = "Dockerfile"
    tag        = ["celsius-fahrenheit:latest"]
  }
}

resource "docker_container" "app" {
  name  = "celsius-fahrenheit"
  image = docker_image.app.name
  ports {
    internal = 3000
    external = 3000
  }
  env = ["NODE_ENV=production"]
}

output "container_id" {
  value = docker_container.app.id
}

output "url" {
  value = "http://localhost:3000"
}
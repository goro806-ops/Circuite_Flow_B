terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

variable "gcp_project_id" {
  type        = string
  description = "Target GCP Project ID"
}

variable "region" {
  type    = string
  default = "us-central1"
}

provider "google" {
  project = var.gcp_project_id
  region  = var.region
}

resource "google_artifact_registry_repository" "saas_repo" {
  location      = var.region
  repository_id = "circuitflow-production"
  description   = "Docker registry for CircuitFlow microservices"
  format        = "DOCKER"
}

resource "google_sql_database_instance" "postgres_instance" {
  name             = "circuitflow-db-prod"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-f1-micro"
    ip_configuration {
      ipv4_enabled = true
    }
  }
  deletion_protection = false
}

output "database_connection_name" {
  value = google_sql_database_instance.postgres_instance.connection_name
}

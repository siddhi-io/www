# Siddhi 5.0 Source Code

## Project Source Code

### Siddhi Core Java Library
[https://github.com/siddhi-io/siddhi](https://github.com/siddhi-io/siddhi) (Java)

Siddhi repo, containing the core Java libraries of Siddhi.

### PySiddhi
[https://github.com/siddhi-io/pysiddhi](https://github.com/siddhi-io/pysiddhi) (Python)

The Python wrapper for Siddhi core Java libraries. This depends on the `siddhi-io/siddhi` repo.

### Siddhi Local Microservice Distribution
[https://github.com/siddhi-io/distribution](https://github.com/siddhi-io/distribution) (Java)

The Microservice distribution of the Siddhi Tooling and Siddhi Runtime. This depends on the `siddhi-io/siddhi` repo. 

### Siddhi Docker Microservice Distribution
[https://github.com/siddhi-io/docker-siddhi](https://github.com/siddhi-io/docker-siddhi) (Docker)

The Docker wrapper for the Siddhi Tooling and Siddhi Runtime. This depends on the `siddhi-io/siddhi` and `siddhi-io/distribution` repos.

### Siddhi Kubernetes Operator
[https://github.com/siddhi-io/siddhi-operator](https://github.com/siddhi-io/siddhi-operator) (Go)

The Siddhi Kubernetes CRD repo deploying Siddhi on Kubernetes. This depends on the `siddhi-io/siddhi`, `siddhi-io/distribution` and `siddhi-io/docker-siddhi` repos.

### Siddhi Extensions

Find the supported Siddhi extensions and source [here](../../docs/extensions) 
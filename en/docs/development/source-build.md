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

## Building the project 

### Building Java Repos

#### Prerequisites
* [Oracle JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html), [OpenJDK 8](http://openjdk.java.net/install/), or JDK 11 (Java 8 should be used for building in order to support both Java 8 and Java 11 at runtime)
* [Maven 3.5.x or later version](https://maven.apache.org/install.html)

#### Steps to Build
1. Get a clone or download source from Github repo, E.g.

    ```bash
    git clone https://github.com/siddhi-io/siddhi.git
    ```
    
2. Run the Maven command ``mvn clean install`` from the root directory
 
  Command | Description
  --- | ---
  `mvn clean install` | Build and install the artifacts into the local repository.
  `mvn clean install -Dmaven.test.skip=true` | Build and install the artifacts into the local repository, without running any of the unit tests.

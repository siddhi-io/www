# Siddhi 5.0 Development Guide

## Obtaining and Building Project Source code 

Find the project source code and the instruction to build the project repos here [here](source).

## Building the project 

### Building Java Repos

#### Prerequisites
* [Oracle JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html), [OpenJDK 8](http://openjdk.java.net/install/), or JDK 11 (Java 8 should be used for building in order to support both Java 8 and Java 11 at runtime)
* [Maven 3.5.x or later version](https://maven.apache.org/install.html)

#### Steps to Build
1. Get a clone or download source from Github Repo, E.g.

    ```bash
    git clone https://github.com/siddhi-io/siddhi.git
    ```
    
2. Run the Maven command ``mvn clean install`` from the root directory
 
  Command | Description
  --- | ---
  `mvn clean install` | Build and install the artifacts into the local repository.
  `mvn clean install -Dmaven.test.skip=true` | Build and install the artifacts into the local repository, without running any of the unit tests.

## Getting Involved in Project Development


 
# Building Siddhi 4.x Repos

## Building Java Repos

### Prerequisites
* [Oracle JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html), [OpenJDK 8](http://openjdk.java.net/install/).
* [Maven 3.5.x or later version](https://maven.apache.org/install.html)

### Steps to Build
1. Get a clone or download source from Github repo, E.g.

    ```bash
    git clone https://github.com/siddhi-io/siddhi.git
    ```
    
2. Run the Maven command ``mvn clean install`` from the root directory
 
  Command | Description
  --- | ---
  `mvn clean install` | Build and install the artifacts into the local repository.
  `mvn clean install -Dmaven.test.skip=true` | Build and install the artifacts into the local repository, without running any of the unit tests.

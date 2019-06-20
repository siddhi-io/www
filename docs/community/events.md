# Code Contribution

## Obtaining the Source Code and Building the Project

### Prerequisites
* [Oracle JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html), [OpenJDK 8](http://openjdk.java.net/install/), or JDK 11 (Java 8 should be used for building in order to support both Java 8 and Java 11 at runtime)
* [Maven 3.5.x or later version](https://maven.apache.org/install.html)

### Steps to Build
1. Get a clone or download source from [Github](https://github.com/siddhi-io/siddhi.git)

    ```bash
    git clone https://github.com/siddhi-io/siddhi.git
    ```
    
1. Run the Maven command ``mvn clean install`` from the root directory
 
  Command | Description
  --- | ---
  `mvn clean install` | Build and install the artifacts into the local repository.
  `mvn clean install -Dmaven.test.skip=true` | Build and install the artifacts into the local repository, without running any of the unit tests.

## Setting up the Developer Environment

Use any of your preferred IDEs (eg: IntelliJ IDEA, Eclipse.. ). Make sure, that your IDE is configured with proper JDK and Maven settings. Import the source code in your IDE and do necessary code changes.
Then add necessary unit tests with respect to your changes. Finally, build the complete Siddhi project with tests and commit the changes to your Github folk once build is successful.

## Commit the Changes
We follow these commit message requirements:

* Separate subject from body with a blank line
* Limit the subject line to 50 characters
* Capitalize the subject line
* Do not end the subject line with a period
* Use the imperative mood in the subject line
* Wrap the body at 72 characters
* Use the body to explain what and why vs. how

Please find details at: [https://chris.beams.io/posts/git-commit/](https://chris.beams.io/posts/git-commit/)

## Accepting Contributor License Agreement (CLA)

Before you submit your first contribution please accept our Contributor License Agreement (CLA). When you send your first Pull Request (PR), GitHub will ask you to accept the CLA.

There is no need to do this before you send your first PR.

Subsequent PRs will not require CLA acceptance.

If for some (unlikely) reason at any time CLA changes, you will get presented with the new CLA text on your first PR after the change.


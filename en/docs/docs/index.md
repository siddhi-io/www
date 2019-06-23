# Siddhi 5.1 User Guide

This section provides information on using and running Siddhi.

Checkout the [Siddhi features](features) to get and idea on what it can do in brief. 

## Writing Siddhi Applications

Writing steam processing logic in Siddhi is all about building Siddhi Applications. A Siddhi Application is a script with `.siddhi` file extension having self-contained stream processing logic. The stream processing constructs, such as streams and queries, defined within a Siddhi App is not visible even to the other Siddhi Apps running in the same JVM.

It is recommended to have different business usecase in separate Siddhi Applications, where it allow users to selectively deploy the applications based on business needs.
It is also recommended to move the repeated steam processing logics that exist in multiple Siddhi Applications, such as message retrieval and preprocessing, to a common Siddhi Application, whereby reducing code duplication and improving maintainability.
In this case, to pass the events from one Siddhi App to another, users can configure common topic using [In-Memory Sink](../../api/latest/#inmemory-sink) and [In-Memory Source](../../api/latest/#inmemory-source) in order to communicate between them.

To write Siddhi Applications using Siddhi Streaming SQL refer [Siddhi Query Guide](query-guide) for details.

For specific API information on Siddhi functions and features refer [Siddhi API Guide](api/latest).

Find out about the supported Siddhi extensions and their versions [here](extensions).

## Executing Siddhi Applications

Siddhi can run in multiple environments as follows.

* [As a Java Library](siddhi-as-a-java-library/)
* [As a Local Microservice](siddhi-as-a-local-microservice/)
* [As a Docker Microservice](siddhi-as-a-docker-microservice/)
* [As a Kubernetes Microservice](siddhi-as-a-kubernetes-microservice/)
* As a Python Library _(WIP)_

## Siddhi Configurations

Refer the [Siddhi Config Guide](config-guide) for information on advance Siddhi execution configurations.

## System Requirements

For all Siddhi execution modes following are the general system requirements.

1. **Memory**   - 128 MB (minimum), 500 MB (recommended), higher memory might be needed based on in-memory data stored for processing
2. **Cores**    - 2 cores (recommended), use lower number of cores after testing Siddhi Apps for performance
3. **JDK**      - 8 or 11
4. To build Siddhi from the Source distribution, it is necessary that you have JDK version 8 or 11 and Maven 3.0.4 or later

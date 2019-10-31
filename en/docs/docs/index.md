# Siddhi 5.1 User Guide

This section provides information on using and running Siddhi.

Checkout the [Siddhi features](features) to get an idea on what it can do in brief. 

## Siddhi Application

Siddhi Application is the artifact that defines the real-time event processing logic of Siddhi as a SQL like script with `.siddhi` file extension. It contains consumers(sources), producers(sinks), streams, queries, tables, functions and other necessary contracts depicting how the events should be consumed, processed and published. 

To write Siddhi Applications using Siddhi Streaming SQL refer [Siddhi Query Guide](query-guide) for details.

For specific API information on Siddhi functions and features refer [Siddhi API Guide](api/latest).

Find out about the supported Siddhi extensions and their versions [here](extensions).

## Executing Siddhi Applications

Siddhi can run in multiple environments as follows.

* [As a Java Library](siddhi-as-a-java-library/)
* [As a Local Microservice](siddhi-as-a-local-microservice/)
* [As a Docker Microservice](siddhi-as-a-docker-microservice/)
* [As a Kubernetes Microservice](siddhi-as-a-kubernetes-microservice/)
* [As a Python Library](siddhi-as-a-python-library)

## Siddhi Configurations

Refer the [Siddhi Config Guide](config-guide) for information on advance Siddhi execution configurations.

## System Requirements

For all Siddhi execution modes following are the general system requirements.

1. **Memory**   - 128 MB (minimum), 500 MB (recommended), higher memory might be needed based on in-memory data stored for processing
2. **Cores**    - 2 cores (recommended), use lower number of cores after testing Siddhi Apps for performance
3. **JDK**      - 8 or 11
4. To build Siddhi from the Source distribution, it is necessary that you have JDK version 8 or 11 and Maven 3.0.4 or later

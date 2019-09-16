# Siddhi Roadmap

The Siddhi road map shows the key features and improvements that are in the pipeline for future releases. We have only listed the high level features and issues in below; we will certainly work on other minor improvements, bug fixes and etc… as well in future releases.

## Latest

- Siddhi Core 5.0.0
    - Localized state management & partition support
    - Fault Stream support for error handling
    - Multiple levels of Metrics (OFF, BASIC, DETAIL) support for Siddhi
    - Extension APIs are improved/changed thus custom extensions that you have written with Siddhi 4.x.x, no longer works in Siddhi 5.0.0. 
- Siddhi documentation upgrades - https://siddhi.io/en/v5.0/docs/

## 2019-Q3

- Siddhi Core 5.1.x
    - Introduce RESET processing mode to preserve memory optimization.
    - Support to create a Sandbox SiddhiAppRuntime for testing purposes
    - Support error handling (log/wait/fault-stream) when event sinks publish data asynchronously.
- Siddhi Extension
    - gRPC IO connector
    - S3 IO connector
    - GCS IO connector 
    - Execution List Connector 
    - Deduplicate support in Unique Extension
- Siddhi Tooling
    - Support K8s/Docker artifacts export in Siddhi editor
    - Overload parameter support in Siddhi source & design editor
- CRDs to support Kubernetes deployments natively
- Support High-Available, Fault Tolerant  Siddhi deployment with NATS
- Siddhi Test Framework: Provides the capability to write integration tests using Docker containers
- CI/CD deployment story for Siddhi 
- Siddhi use case guides - https://siddhi.io/en/v5.1/docs/

## 2019-Q4

- Prometheus for metrics collection
- Support distributed Siddhi deployment with NATS
- Siddhi plugin for VSCode 
- JDBC driver for Siddhi Query APIs
- Support templating Siddhi apps and configurations in Tooling

## 2020 +

- Kafka support for Siddhi K8s deployment
- Siddhi support in Golang
- Enhance management of secrets with vault services
- Evaluate Istio integration 
- Allow to specify dependencies in the Siddhi Custom resource 
- Cloud Foundry installation support

If you have any queries or comments on the roadmap, please let us know via GitHub [here](https://github.com/siddhi-io/siddhi/issues). You can also always communicate through Google Group or Slack with us on our [community page](https://siddhi.io/community/). You feedback and contribution is always welcome.


# Siddhi 5.1 Features

!!! info "New features of Siddhi 5.1"
    Information on new features of Siddhi 5.1 can be found in the [release blog](https://medium.com/siddhi-io/whats-new-in-siddhi-cnsp-5-1-0-331b7e185d24).
        
## Development and deployment

### SQL like language for event processing
   
- [Siddhi Streaming SQL](../query-guide/) allows writing processing logic for event consumption, processing, integration, and publishing as a SQL script.

### Web based editor

- [Siddhi Editor](../tooling/) provides graphical drag-and-drop and source-based query building capability, with event flow visualization, syntax highlighting, auto-completion, and error handling support. 
- Event simulation support to test the apps by sending events one by one, as a feed, or from CSV or database. 
- Ability to export the developed apps as `.siddhi` files, or as Docker or Kubernetes artifacts with necessary extensions.

### CI/CD pipeline 

- Siddhi test framework provides tools to build unit, integration, and black-box tests, to achieve [CI/CD pipeline](https://medium.com/siddhi-io/building-an-efficient-ci-cd-pipeline-for-siddhi-c33150721b5d) with agile DevOps workflow. 
- App version management supported by manging `.siddhi` files in a preferred version control system.

### Multiple deployment options

- Embedded execution in [Java](../siddhi-as-a-java-library/) and [Python](../siddhi-as-a-python-library) as libraries.
- Run as a standalone microservice in [bare-metal, VM](../siddhi-as-a-local-microservice/), or [Docker](../siddhi-as-a-docker-microservice/).
- Deploy and run as a standalone or as distributed microservices [natively in Kubernetes](../siddhi-as-a-kubernetes-microservice/), using Siddhi Kubernetes operator. 

## Functionality 

### Consume and publish events with various data formats

- [Consume](../query-guide/#source) and [publish](../query-guide/#sink) events via `NATS`, `Kafka`, `RabbitMQ`, `HTTP`, `gRPC`, `TCP`, `JMS`, `IBM MQ`, `MQTT`, `Amazon SQS`, `Google Pub/Sub`, `Email`, `WebSocket`, `File`, `Change Data Capture (CDC)` (From `MySQL`, `Oracle`, `MSSQL`, `DB2`, `Postgre`), `S3`, `Google Cloud Storage`, and `in-memory`.
- Support [message formats](../query-guide/#source-mapper) such as `JSON`, `XML`, `Avro`, `Protobuf`, `Text`, `Binary`, `Key-value`, and `CSV`.
- Rate-limit the output based on [time and number of events](../query-guide/#output-rate-limiting). 
- Perform [load balancing and failover](../query-guide/#distributed-sink) when publishing events to endpoints.

### Data filtering and preprocessing    
                
- [Filter](../query-guide/#filter) event based on conditions such as value ranges, string matching, regex, and others.
- Clean data by setting defaults, and handling nulls, using [`default`](../api/latest/#default-function), [`if-then-else`](../api/latest/#ifthenelse-function) functions, and many others.

### Date transformation

- Support [data extraction](../api/latest/#getbool-function) and [reconstruction of messages](../api/latest/#group-aggregate-function).
- Inline [mathematical and logical operations](../query-guide/#select).
- Inbuilt functions and [60+ extensions](../extensions/#available-extensions) for processing `JSON`, `string`, `time`, `math`, `regex`, and others.
- Ability to write custom functions in [`JavaScript`](../query-guide/#script), and [`Java`](../extensions/#writing-custom-extensions).

### Data store integration with caching

- Query, modify, and join the data stored [`in-memory` tables](../query-guide/#table) which support primary key constraints and indexing.
- Query, modify, and join the data stored in [stores backed by systems](../query-guide/#store) such as RDBMS (`MySQL`, `Oracle`, `MSSQL`, `DB2`, `Postgre`, `H2`), `Redis`, `Hazelcast`, `MongoDB`, `HBase`, `Cassandra`, `Solr`, and `Elasticsearch`. 
- Support low latency processing by preloading and caching data using caching modes such as `FIFO`, `LRU`, and `RFU`.

### Service integration and error handling

- Support for calling [`HTTP`](../api/latest/#http-call-sink) and [`gRPC`](../api/latest/#grpc-call-sink) services in a non-blocking manner to fetch data and enrich events.
- Handle responses accordingly for different response status codes.
- Various [error handling options](../query-guide/#error-handling) to handle endpoint unavailability while retrying to connect, such as;
    - Logging and dropping the events.
    - Waiting indefinitely and not consuming events from the sources. 
    - Divert the events to error stream to handle the errors gracefully.  

### Data Summarization

- [Aggregate of data](../query-guide/#aggregate-function) using `sum`, `count`, average (`avg`), `min`, `max`, `distinctCount`, and standard deviation (`StdDev`) operators.     
- Event summarization based on time intervals using `sliding time`, or `tumbling/batch time` [windows](../query-guide/#window).
- Event summarization based on number of events using `sliding length`, and `tumbling/batch length` [windows](../query-guide/#window).
- Support for data summarization based on sessions and uniqueness. 
- Ability to run long running aggregations with time granularities from seconds to years using both in-memory and databases via [`named aggregation`](../query-guide/#named-aggregation).
- Support to aggregate data based on [`group by` fields](../query-guide/#group-by), filter aggregated data using [`having` conditions](../query-guide/#having), and sort & limit the aggregated output using [`order by`](../query-guide/#order-by) & [`limit`](../query-guide/#limit-offset) keywords.

### Rule processing

- Execution of rules based on single event using [`filter`](../query-guide/#filter) operator, `if-then-else` and `match` [functions](../query-guide/#function), and many others.
- Rules based on collection of events using [data summarization](../query-guide/#aggregate-function), and joins with [streams](../query-guide/#join-stream), [tables](../query-guide/#join-table), [windows](../query-guide/#join-named-window) or [aggregations](../query-guide/#join-named-aggregation).
- Rules to detect event occurrence patterns, trends, or non-occurrence of a critical events using complex event processing constructs such as [`pattern`](../query-guide/#pattern), and [`sequence`](../query-guide/#sequence). 

### Serving online and predefined ML models

- Serve pre-created ML models based on [`TensorFlow`](https://siddhi-io.github.io/siddhi-execution-tensorflow/) or [`PMML`](https://siddhi-io.github.io/siddhi-gpl-execution-pmml/) that are built via Python, R, Spark, H2O.ai, or others. 
- Ability to call models via HTTP or gRPC for decision making. 
- [Online machine learning](https://siddhi-io.github.io/siddhi-execution-streamingml/) for clustering, classification, and regression. 
- Anomaly detection using markov chains.

### Scatter-gather and data pipeline

- Process complex messages by dividing them into simple messages using [`tokenize`](../api/latest/#tokenize-stream-processor) function, process or transform them in isolation, and group them back using the [`batch`](../api/latest/#batch-window) window and [`group`](../api/latest/#group-aggregate-function) aggregation.
- Ability to modularize the execution logic of each use case into a single `.siddhi` file (Siddhi Application), and connect them using [`in-memory` source](../api/latest/#inmemory-source) and [`in-memory` sink](../api/latest/#inmemory-sink) to build a composite event-driven application.     
- Provide execution isolation and parallel processing by [partitioning](../query-guide/#partition) the events using keys or value ranges.
- Periodically trigger data pipelines based on time intervals, and cron expression, or at App startup using [`triggers`](../query-guide/#trigger). 
- Synchronize and parallelize event processing using [`@sync` annotations](../query-guide/#threading-and-synchronization). 
- Ability to [alter the speed of processing](../query-guide/#event-playback) based on event generation time.

### Realtime decisions as a service

- Act as an HTTP or gRPC service to provide realtime synchronous decisions via [`service` source](../api/latest/#http-service-source) and [`service-Response` sink](../api/latest/#http-service-response-sink).    
- Provide [REST APIs](../rest-guides/on-demand-query-api/) to [query](../query-guide/#on-demand-query) `in-memory tables`, `windows`, `named-aggregations`, and database backed stores such as RDBMS, NoSQL DBs to make decisions based on the state of the system.

### Snapshot and restore

- Support for [periodic incremental state persistence](../config-guide/#configuring-periodic-state-persistence) to allow state restoration during failures.

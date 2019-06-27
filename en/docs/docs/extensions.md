# Siddhi Extensions

Following are some supported Siddhi extensions;

## Extensions released under Apache 2.0 License

### Execution Extensions

Name | Description | Latest <br/>Tested <br/>Version 
:-- | :-- | :--
<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-string">execution-string</a> | Provides basic string handling capabilities such as concat, length, replace all, etc. | [5.0.3](https://mvnrepository.com/artifact/io.siddhi.extension.execution.string/siddhi-execution-string/5.0.3)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-regex">execution-regex</a> | Provides basic RegEx execution capabilities. | [5.0.3](https://mvnrepository.com/artifact/io.siddhi.extension.execution.regex/siddhi-execution-regex/5.0.3)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-math">execution-math</a> | Provides useful mathematical functions. | [5.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.execution.math/siddhi-execution-math/5.0.2)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-time">execution-time</a> | Provides time related functionality such as getting current time, current date, manipulating/formatting dates, etc. | [5.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.execution.time/siddhi-execution-time/5.0.2)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-map">execution-map</a> | Provides the capability to generate and manipulate map data objects. | [5.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.execution.map/siddhi-execution-map/5.0.2)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-json">execution-json</a> | Provides the capability to retrieve, insert, and modify JSON elements. | [2.0.1](https://mvnrepository.com/artifact/io.siddhi.extension.execution.json/siddhi-execution-json/2.0.1)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-unitconversion">execution-unitconversion</a> | Converts various units such as length, mass, time and volume. | [2.0.1](https://mvnrepository.com/artifact/io.siddhi.extension.execution.unitconversion/siddhi-execution-unitconversion/2.0.1)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-reorder">execution-reorder</a> | Orders out-of-order event arrivals using algorithms such as K-Slack and alpha K-Stack. |  [5.0.0](https://mvnrepository.com/artifact/io.siddhi.extension.execution.reorder/siddhi-execution-reorder/5.0.0)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-unique">execution-unique</a> | Retains and process unique events based on the given parameters. |[5.0.0](https://mvnrepository.com/artifact/io.siddhi.extension.execution.unique/siddhi-execution-unique/5.0.0)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-streamingml">execution-streamingml</a> | Performs streaming machine learning (clustering, classification and regression) on event streams. | [2.0.1](https://mvnrepository.com/artifact/io.siddhi.extension.execution.streamingml/siddhi-execution-streamingml/2.0.1)

### Input/Output Extensions

Name | Description | Latest <br/>Tested <br/>Version
:-- | :-- | :--
<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-http">io-http</a> | Receives and publishes events via http and https transports, calls external services, and serves incoming requests and provide synchronous responses. | [2.0.6](https://mvnrepository.com/artifact/io.siddhi.extension.io.http/siddhi-io-http/2.0.6)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-nats">io-nats</a> | Receives and publishes events from/to NATS. | [2.0.3](https://mvnrepository.com/artifact/io.siddhi.extension.io.nats/siddhi-io-nats/2.0.3)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-kafka">io-kafka</a> | Receives and publishes events from/to Kafka. |  [5.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.io.kafka/siddhi-io-kafka/5.0.2)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-email">io-email</a> | Receives and publishes events via email using `smtp`, `pop3` and `imap` protocols. | [2.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.io.email/siddhi-io-email/2.0.2)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-cdc">io-cdc</a> | Captures change data from databases such as MySQL, MS SQL, Postgresql, H2 and Oracle. | [2.0.1](https://mvnrepository.com/artifact/io.siddhi.extension.io.cdc/siddhi-io-cdc/2.0.1)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-tcp">io-tcp</a> | Receives and publishes events through TCP transport. | [3.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.io.tcp/siddhi-io-tcp/3.0.2)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-googlepubsub">io-googlepubsub</a> | Receives and publishes events through Google Pub/Sub.| [2.0.1](https://mvnrepository.com/artifact/io.siddhi.extension.io.googlepubsub/siddhi-io-googlepubsub/2.0.1)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-file">io-file</a> | Receives and publishes event data from/to files. | [2.0.1](https://mvnrepository.com/artifact/io.siddhi.extension.io.file/siddhi-io-file/2.0.1)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-jms">io-jms</a> | Receives and publishes events via Java Message Service (JMS), supporting Message brokers such as ActiveMQ | [2.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.io.jms/siddhi-io-jms/2.0.2)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-prometheus">io-prometheus</a> | Consumes and expose Prometheus metrics from/to Prometheus server. | [2.0.1](https://mvnrepository.com/artifact/io.siddhi.extension.io.prometheus/siddhi-io-prometheus/2.0.1)

### Data Mapping Extensions

Name | Description | Latest <br/>Tested <br/>Version
:-- | :-- | :--
<a target="_blank" href="https://siddhi-io.github.io/siddhi-map-json">map-json</a> | Converts JSON messages to/from Siddhi events. | [5.0.3](https://mvnrepository.com/artifact/io.siddhi.extension.map.json/siddhi-map-json/5.0.3)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-map-xml">map-xml</a> | Converts XML messages to/from Siddhi events. | [5.0.3](https://mvnrepository.com/artifact/io.siddhi.extension.map.xml/siddhi-map-xml/5.0.3)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-map-text">map-text</a> | Converts text messages to/from Siddhi events. | [2.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.map.text/siddhi-map-text/2.0.2)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-map-avro">map-avro</a> | Converts AVRO messages to/from Siddhi events. | [2.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.map.avro/siddhi-map-avro/2.0.2)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-map-keyvalue">map-keyvalue</a> | Converts events having Key-Value maps to/from Siddhi events. | [2.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.map.keyvalue/siddhi-map-keyvalue/2.0.2)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-map-csv">map-csv</a> | Converts messages with CSV format to/from Siddhi events. | [2.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.map.csv/siddhi-map-csv/2.0.2)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-map-binary">map-binary</a> | Converts binary events that adheres to Siddhi format to/from Siddhi events. | [2.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.map.binary/siddhi-map-binary/2.0.2)

### Store Extensions
Name | Description | Latest <br/>Tested <br/>Version
:-- | :-- | :--
<a target="_blank" href="https://siddhi-io.github.io/siddhi-store-rdbms">store-rdbms</a> | Persist and retrieve events to/from RDBMS databases such as MySQL, MS SQL, Postgresql, H2 and Oracle. | [6.0.1](https://mvnrepository.com/artifact/io.siddhi.extension.store.rdbms/siddhi-store-rdbms/6.0.1)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-store-mongodb">store-mongodb</a> | Persist and retrieve events to/from MongoDB. | [2.0.1](https://mvnrepository.com/artifact/io.siddhi.extension.store.mongodb/siddhi-store-mongodb/2.0.1)
<a target="_blank" href="https://siddhi-io.github.io/siddhi-store-elasticsearch">store-elasticsearch</a> | Persist and retrieve events to/from Elasticsearch. | [3.0.0](https://mvnrepository.com/artifact/io.siddhi.extension.store.elasticsearch/siddhi-store-elasticsearch/3.0.0)

### Script Extensions
Name | Description | Latest <br/>Tested <br/>Version
:-- | :-- | :--
<a target="_blank" href="https://siddhi-io.github.io/siddhi-script-js">script-js</a> | Allows writing user defined JavaScript functions within Siddhi Applications to process events. |[5.0.1](https://mvnrepository.com/artifact/io.siddhi.extension.script.js/siddhi-script-js/5.0.1)


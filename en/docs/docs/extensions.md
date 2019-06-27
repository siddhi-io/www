# Siddhi Extensions

Following are some supported Siddhi extensions;

## Extensions released under Apache 2.0 License

### Execution Extensions

Name | Description | Latest <br/>Tested <br/>Version 
:-- | :-- | :--
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-string">execution-string</a> | Provides basic string handling capabilities such as concat, length, replace all, etc. | [4.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.string/siddhi-execution-string/4.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-regex">execution-regex</a> | Provides basic RegEx execution capabilities. | [4.1.2](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.regex/siddhi-execution-regex/4.1.2)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-math">execution-math</a> | Provides useful mathematical functions. | [4.1.2](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.math/siddhi-execution-math/4.1.2)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-time">execution-time</a> | Provides time related functionality such as getting current time, current date, manipulating/formatting dates, etc. | [4.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.time/siddhi-execution-time/4.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-map">execution-map</a> | Provides the capability to generate and manipulate map data objects. | [4.1.0](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.map/siddhi-execution-map/4.1.0)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-json">execution-json</a> | Provides the capability to retrieve, insert, and modify JSON elements. | [1.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.json/siddhi-execution-json/1.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-unitconversion">execution-unitconversion</a> | Converts various units such as length, mass, time and volume. | [1.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.unitconversion/siddhi-execution-unitconversion/1.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-reorder">execution-reorder</a> | Orders out-of-order event arrivals using algorithms such as K-Slack and alpha K-Stack. |  [4.2.2](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.reorder/siddhi-execution-reorder/4.2.2)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-geo">execution-geo</a> | Provides geo data related functionality such as such as geocode, reverse geocode and finding places based on IP. | [4.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.geo/siddhi-execution-geo/4.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-env">execution-env</a> | Dynamically read environment properties inside Siddhi Apps. | [1.1.0](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.env/siddhi-execution-env/1.1.0)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-graph">execution-graph</a> | Provides graph related functionality such as getting size of largest connected component, maximum clique size of a graph, etc. | [1.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.graph/siddhi-execution-graph/1.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-priority">execution-priority</a> | Keeps track of the events based on priority. | [4.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.priority/siddhi-execution-priority/4.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-extrema">execution-extrema</a> |  Extract the extrema from the event streams such as min, max, topK and bottomK. | [4.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.extrema/siddhi-execution-extrema/4.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-unique">execution-unique</a> | Retains and process unique events based on the given parameters. |[4.1.2](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.unique/siddhi-execution-unique/4.1.2)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-stats">execution-stats</a> | Provides statistical functions such as median calculation. | [1.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.stats/siddhi-execution-stats/1.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-timeseries">execution-timeseries</a> | Enables forecast and detection of outliers in time series data, using Linear Regression models. |[4.1.2](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.timeseries/siddhi-execution-timeseries/4.1.2)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-streamingml">execution-streamingml</a> | Performs streaming machine learning (clustering, classification and regression) on event streams. | [1.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.streamingml/siddhi-execution-streamingml/1.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-tensorflow">execution-tensorflow</a> | Supports running pre-built TensorFlow models. | [1.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.tensorflow/siddhi-execution-tensorflow/1.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-markov">execution-markov</a> | Detects abnormal sequence of event occurrences using probability. |  [4.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.markov/siddhi-execution-markov/4.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-kalmanfilter">execution-kalmanfilter</a> | Provides Kalman filtering capabilities to estimate values and detect outliers of input data. |  [4.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.kalmanfilter/siddhi-execution-kalman-filter/4.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-sentiment">execution-sentiment</a> | Performs sentiment analysis using Afinn Wordlist. |  [4.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.sentiment/siddhi-execution-sentiment/4.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-execution-approximate">execution-approximate</a> | Performs approximate computing on event streams. | [1.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.execution.approximate/siddhi-execution-approximate/1.1.1)

### Input/Output Extensions

Name | Description | Latest <br/>Tested <br/>Version
:-- | :-- | :--
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-http">io-http</a> | Receives and publishes events via http and https transports, calls external services, and serves incoming requests and provide synchronous responses. | [1.2.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.http/siddhi-io-http/1.2.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-nats">io-nats</a> | Receives and publishes events from/to NATS. | [1.0.5](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.nats/siddhi-io-nats/1.0.5)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-kafka">io-kafka</a> | Receives and publishes events from/to Kafka. |  [4.2.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.kafka/siddhi-io-kafka/4.2.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-email">io-email</a> | Receives and publishes events via email using `smtp`, `pop3` and `imap` protocols. | [1.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.email/siddhi-io-email/1.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-cdc">io-cdc</a> | Captures change data from databases such as MySQL, MS SQL, Postgresql, H2 and Oracle. | [1.0.10](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.cdc/siddhi-io-cdc/1.0.10)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-tcp">io-tcp</a> | Receives and publishes events through TCP transport. | [2.1.2](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.tcp/siddhi-io-tcp/2.1.2)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-googlepubsub">io-googlepubsub</a> | Receives and publishes events through Google Pub/Sub.| [1.0.4](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.googlepubsub/siddhi-io-googlepubsub/1.0.4)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-websocket">io-websocket</a> | Receives and publishes events through WebSocket.| [1.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.websocket/siddhi-io-websocket/1.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-file">io-file</a> | Receives and publishes event data from/to files. | [1.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.file/siddhi-io-file/1.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-jms">io-jms</a> | Receives and publishes events via Java Message Service (JMS), supporting Message brokers such as ActiveMQ | [1.1.2](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.jms/siddhi-io-jms/1.1.2)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-mqtt">io-mqtt</a> | Receives and publishes events from/to Kafka MQTT broker. | [1.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.mqtt/siddhi-io-mqtt/1.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-sqs">io-sqs</a> | Receives and publishes events from/to AWS SQS Services. | [1.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.sqs/siddhi-io-sqs/1.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-rabbitmq">io-rabbitmq</a> | Receives and publishes events from/to RabbitMQ broker. | [1.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.rabbitmq/siddhi-io-rabbitmq/1.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-ibmmq">io-ibmmq</a> | Receives and publishes events from/to IBM MQ broker. | [1.1.2](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.ibmmq/siddhi-io-ibmmq/1.1.2)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-hl7">io-hl7</a> | Receives and publishes events through hl7 transport. | [1.0.4](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.hl7/siddhi-io-hl7/1.0.4)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-snmp">io-snmp</a> | Receives and publishes events through SNMP transport. | [1.0.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.snmp/siddhi-io-snmp/1.0.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-prometheus">io-prometheus</a> | Consumes and expose Prometheus metrics from/to Prometheus server. | [1.0.3](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.prometheus/siddhi-io-prometheus/1.0.3)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-twitter">io-twitter</a> | Publishes events to Twitter. | [1.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.twitter/siddhi-io-twitter/1.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-io-wso2event">io-wso2event</a> | Receives and publishes events in the WSO2Event format via Thrift or Binary protocols. | [4.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.io.wso2event/siddhi-io-wso2event/4.1.1)

### Data Mapping Extensions

Name | Description | Latest <br/>Tested <br/>Version
:-- | :-- | :--
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-map-json">map-json</a> | Converts JSON messages to/from Siddhi events. | [4.1.2](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.map.json/siddhi-map-json/4.1.2)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-map-xml">map-xml</a> | Converts XML messages to/from Siddhi events. | [4.1.2](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.map.xml/siddhi-map-xml/4.1.2)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-map-text">map-text</a> | Converts text messages to/from Siddhi events. | [1.1.2](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.map.text/siddhi-map-text/1.1.2)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-map-avro">map-avro</a> | Converts AVRO messages to/from Siddhi events. | [1.0.67](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.map.avro/siddhi-map-avro/1.0.67)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-map-keyvalue">map-keyvalue</a> | Converts events having Key-Value maps to/from Siddhi events. | [1.1.2](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.map.keyvalue/siddhi-map-keyvalue/1.1.2 )
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-map-csv">map-csv</a> | Converts messages with CSV format to/from Siddhi events. | [1.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.map.csv/siddhi-map-csv/1.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-map-binary">map-binary</a> | Converts binary events that adheres to Siddhi format to/from Siddhi events. | [1.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.map.binary/siddhi-map-binary/1.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-map-wso2event">map-wso2event</a> | Converts WSO2 events to/from Siddhi events. | [4.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.map.wso2event/siddhi-map-wso2event/4.1.1)

### Store Extensions
Name | Description | Latest <br/>Tested <br/>Version
:-- | :-- | :--
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-store-rdbms">store-rdbms</a> | Persist and retrieve events to/from RDBMS databases such as MySQL, MS SQL, Postgresql, H2 and Oracle. | [5.1.7](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.store.rdbms/siddhi-store-rdbms/5.1.7)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-store-mongodb">store-mongodb</a> | Persist and retrieve events to/from MongoDB. | [1.1.0](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.store.mongodb/siddhi-store-mongodb/1.1.0)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-store-elasticsearch">store-elasticsearch</a> | Persist and retrieve events to/from Elasticsearch. | [2.0.0](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.store.elasticsearch/siddhi-store-elasticsearch/2.0.0)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-store-redis">store-redis</a> | Persist and retrieve events to/from Redis. | [2.1.0](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.store.redis/siddhi-store-redis/2.1.0)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-store-cassandra">store-cassandra</a> | Persist and retrieve events to/from Cassandra. | [1.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.store.cassandra/siddhi-store-cassandra/1.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-store-hbase">store-hbase</a> | Persist and retrieve events to/from HBase. | [4.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.store.hbase/siddhi-store-hbase/4.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-store-solr">store-solr</a> | Persist and retrieve events to/from Apache Solr. | [1.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.store.solr/siddhi-store-solr/1.1.1)
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-store-influxdb">store-influxdb</a> | Persist and retrieve events to/from InfluxDB. | [1.0.2](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.store.influxdb/siddhi-store-influxdb/1.0.2)

### Script Extensions
Name | Description | Latest <br/>Tested <br/>Version
:-- | :-- | :--
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-script-js">script-js</a> | Allows writing user defined JavaScript functions within Siddhi Applications to process events. |[4.1.1](https://mvnrepository.com/artifact/org.wso2.extension.siddhi.script.js/siddhi-script-js/4.1.1)

## Extensions released under GPL License

### Execution Extensions

Name | Description | Latest <br/>Tested <br/>Version
:-- | :-- | :--
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-gpl-execution-pmml">execution-pmml</a> | Process pre built PMML Machine Learning models. |
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-gpl-execution-streamingml">execution-streamingml</a> | Performs streaming machine learning on event streams. |
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-gpl-execution-geo">execution-geo</a> | Provides geo data related functionality such as geo-fence, distance, closest points, etc. |
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-gpl-execution-nlp">execution-nlp</a> | Process natural language processing functionality. |

### Script Extensions
Name | Description | Latest <br/>Tested <br/>Version
:-- | :-- | :--
<a target="_blank" href="https://wso2-extensions.github.io/siddhi-gpl-execution-r">execution-r</a> |  Allows writing user defined R functions within Siddhi Applications to process events. | 

# Siddhi Extensions

Siddhi provides an extension architecture to enhance its functionality by incorporating other libraries and custom logic in a seamless manner. Each extension has a namespace that can be used to identify and specifically access the functionality of the relevant extension.

Following are the supported Siddhi extension types: 

* Execution extension types
    * [Function](../query-guide/#function) extension.
    * [Aggregate Function](../query-guide/#aggregate-function) extension.
    * [Window](../query-guide/#window) extension.
    * [Stream Function](../query-guide/#stream-function) extension.
    * [Stream Processor](../query-guide/#stream-processor) extension.

* IO extension types
    * [Source](../query-guide/#sink) extension.
    * [Sink](../query-guide/#sink) extension.

* Map extension types
    * [Source Mapper](../query-guide/#source-mapper) extension.
    * [Sink Mapper](../query-guide/#sink-mapper) extension.

* Store extension types
    * [Store](../query-guide/#store) extension.

* Script extension types
    * [Script](../query-guide/#script) extension.

## Available Extensions

All the Siddhi extensions are released under Apache 2.0 License.

### Execution Extensions

|Name | Description | Latest <br/>Tested <br/>Version
|:-- | :-- | :--
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-string">execution-string</a> | Provides basic string handling capabilities such as concat, length, replace all, etc. | [5.0.7](https://mvnrepository.com/artifact/io.siddhi.extension.execution.string/siddhi-execution-string/5.0.7)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-regex">execution-regex</a> | Provides basic RegEx execution capabilities. | [5.0.5](https://mvnrepository.com/artifact/io.siddhi.extension.execution.regex/siddhi-execution-regex/5.0.5)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-math">execution-math</a> | Provides useful mathematical functions. | [5.0.4](https://mvnrepository.com/artifact/io.siddhi.extension.execution.math/siddhi-execution-math/5.0.4)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-time">execution-time</a> | Provides time related functionality such as getting current time, current date, manipulating/formatting dates, etc. | [5.0.4](https://mvnrepository.com/artifact/io.siddhi.extension.execution.time/siddhi-execution-time/5.0.4)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-map">execution-map</a> | Provides the capability to generate and manipulate map data objects. | [5.0.4](https://mvnrepository.com/artifact/io.siddhi.extension.execution.map/siddhi-execution-map/5.0.4)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-json">execution-json</a> | Provides the capability to retrieve, insert, and modify JSON elements. | [2.0.4](https://mvnrepository.com/artifact/io.siddhi.extension.execution.json/siddhi-execution-json/2.0.4)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-unitconversion">execution-unitconversion</a> | Converts various units such as length, mass, time and volume. | [2.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.execution.unitconversion/siddhi-execution-unitconversion/2.0.2)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-reorder">execution-reorder</a> | Orders out-of-order event arrivals using algorithms such as K-Slack and alpha K-Stack. |  [5.0.3](https://mvnrepository.com/artifact/io.siddhi.extension.execution.reorder/siddhi-execution-reorder/5.0.3)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-unique">execution-unique</a> | Retains and process unique events based on the given parameters. |[5.0.4](https://mvnrepository.com/artifact/io.siddhi.extension.execution.unique/siddhi-execution-unique/5.0.4)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-list">execution-list</a> | Provides the capability to send an array object inside Siddhi stream definitions and use it within queries. | [1.0.0](https://mvnrepository.com/artifact/io.siddhi.extension.execution.list/siddhi-execution-list/1.0.0)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-streamingml">execution-streamingml</a> | Performs streaming machine learning (clustering, classification and regression) on event streams. | [2.0.3](https://mvnrepository.com/artifact/io.siddhi.extension.execution.streamingml/siddhi-execution-streamingml/2.0.3)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-execution-tensorflow">execution-tensorflow</a> | Provides support for running pre-built TensorFlow models. | [2.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.execution.tensorflow/siddhi-execution-tensorflow/2.0.2)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-gpl-execution-pmml">execution-pmml</a> | Evaluates Predictive Model Markup Language (PMML). It is under GPL license. | [5.0.1](https://mvnrepository.com/artifact/io.siddhi.extension.gpl.execution.pmml/siddhi-gpl-execution-pmml/5.0.1)

### Input/Output Extensions

|Name | Description | Latest <br/>Tested <br/>Version
|:-- | :-- | :--
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-http">io-http</a> | Receives and publishes events via http and https transports, calls external services, and serves incoming requests and provide synchronous responses. | [2.1.2](https://mvnrepository.com/artifact/io.siddhi.extension.io.http/siddhi-io-http/2.1.2)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-nats">io-nats</a> | Receives and publishes events from/to NATS. | [2.0.6](https://mvnrepository.com/artifact/io.siddhi.extension.io.nats/siddhi-io-nats/2.0.6)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-kafka">io-kafka</a> | Receives and publishes events from/to Kafka. |  [5.0.4](https://mvnrepository.com/artifact/io.siddhi.extension.io.kafka/siddhi-io-kafka/5.0.4)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-email">io-email</a> | Receives and publishes events via email using `smtp`, `pop3` and `imap` protocols. | [2.0.4](https://mvnrepository.com/artifact/io.siddhi.extension.io.email/siddhi-io-email/2.0.4)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-cdc">io-cdc</a> | Captures change data from databases such as MySQL, MS SQL, Postgresql, H2 and Oracle. | [2.0.3](https://mvnrepository.com/artifact/io.siddhi.extension.io.cdc/siddhi-io-cdc/2.0.3)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-tcp">io-tcp</a> | Receives and publishes events through TCP transport. | [3.0.4](https://mvnrepository.com/artifact/io.siddhi.extension.io.tcp/siddhi-io-tcp/3.0.4)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-googlepubsub">io-googlepubsub</a> | Receives and publishes events through Google Pub/Sub.| [2.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.io.googlepubsub/siddhi-io-googlepubsub/2.0.2)
|<a target="_blank" href="https://github.com/siddhi-io/siddhi-io-rabbitmq">io-rabbitmq</a> | Receives and publishes events from/to RabbitMQ.| [3.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.io.rabbitmq/siddhi-io-rabbitmq/3.0.2)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-file">io-file</a> | Receives and publishes event data from/to files. | [2.0.3](https://mvnrepository.com/artifact/io.siddhi.extension.io.file/siddhi-io-file/2.0.3)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-jms">io-jms</a> | Receives and publishes events via Java Message Service (JMS), supporting Message brokers such as ActiveMQ | [2.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.io.jms/siddhi-io-jms/2.0.2)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-prometheus">io-prometheus</a> | Consumes and expose Prometheus metrics from/to Prometheus server. | [2.1.0](https://mvnrepository.com/artifact/io.siddhi.extension.io.prometheus/siddhi-io-prometheus/2.1.0)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-grpc">io-grpc</a> | Receives and publishes events via gRpc. | [1.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.io.grpc/siddhi-io-grpc/1.0.2)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-mqtt">io-mqtt</a> | Allows to receive and publish events from/to mqtt broker. | [3.0.0](https://mvnrepository.com/artifact/io.siddhi.extension.io.mqtt/siddhi-io-mqtt/3.0.0)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-sqs">io-sqs</a> | Subscribes to a SQS queue and receive/publish SQS messages. | [3.0.0](https://mvnrepository.com/artifact/io.siddhi.extension.io.sqs/siddhi-io-sqs/3.0.0)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-s3">io-s3</a> | Allows you to publish/retrieve events to/from Amazon AWS S3. | [1.0.1](https://mvnrepository.com/artifact/io.siddhi.extension.io.s3/siddhi-io-s3/1.0.1)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-io-gcs">io-gcs</a> | Receives/publishes events from/to Google Cloud Storage bucket. | [1.0.0](https://mvnrepository.com/artifact/io.siddhi.extension.io.gcs/siddhi-io-gcs/1.0.0)

### Data Mapping Extensions

|Name | Description | Latest <br/>Tested <br/>Version
|:-- | :-- | :--
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-map-json">map-json</a> | Converts JSON messages to/from Siddhi events. | [5.0.4](https://mvnrepository.com/artifact/io.siddhi.extension.map.json/siddhi-map-json/5.0.4)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-map-xml">map-xml</a> | Converts XML messages to/from Siddhi events. | [5.0.3](https://mvnrepository.com/artifact/io.siddhi.extension.map.xml/siddhi-map-xml/5.0.3)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-map-text">map-text</a> | Converts text messages to/from Siddhi events. | [2.0.4](https://mvnrepository.com/artifact/io.siddhi.extension.map.text/siddhi-map-text/2.0.4)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-map-avro">map-avro</a> | Converts AVRO messages to/from Siddhi events. | [2.0.5](https://mvnrepository.com/artifact/io.siddhi.extension.map.avro/siddhi-map-avro/2.0.5)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-map-keyvalue">map-keyvalue</a> | Converts events having Key-Value maps to/from Siddhi events. | [2.0.4](https://mvnrepository.com/artifact/io.siddhi.extension.map.keyvalue/siddhi-map-keyvalue/2.0.4)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-map-csv">map-csv</a> | Converts messages with CSV format to/from Siddhi events. | [2.0.3](https://mvnrepository.com/artifact/io.siddhi.extension.map.csv/siddhi-map-csv/2.0.3)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-map-binary">map-binary</a> | Converts binary events that adheres to Siddhi format to/from Siddhi events. | [2.0.4](https://mvnrepository.com/artifact/io.siddhi.extension.map.binary/siddhi-map-binary/2.0.4)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-map-protobuf">map-protobuf</a> | Converts protobuf messages to/from Siddhi events.. | [1.0.1](https://mvnrepository.com/artifact/io.siddhi.extension.map.protobuf/siddhi-map-protobuf/1.0.1)

### Store Extensions

|Name | Description | Latest <br/>Tested <br/>Version
|:-- | :-- | :--
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-store-rdbms">store-rdbms</a> | Optimally stores, retrieves, and manipulates data on RDBMS databases such as MySQL, MS SQL, Postgresql, H2 and Oracle. | [7.0.0](https://mvnrepository.com/artifact/io.siddhi.extension.store.rdbms/siddhi-store-rdbms/7.0.0)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-store-mongodb">store-mongodb</a> | Stores, retrieves, and manipulates data on MongoDB. | [2.0.3](https://mvnrepository.com/artifact/io.siddhi.extension.store.mongodb/siddhi-store-mongodb/2.0.3)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-store-redis">store-redis</a> | Stores, retrieves, and manipulates data on Redis. | [3.1.1](https://mvnrepository.com/artifact/io.siddhi.extension.store.redis/siddhi-store-redis/3.1.1)
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-store-elasticsearch">store-elasticsearch</a> | Stores, retrieves, and manipulates data on Elasticsearch. | [3.1.2](https://mvnrepository.com/artifact/io.siddhi.extension.store.elasticsearch/siddhi-store-elasticsearch/3.1.2)

### Script Extensions

|Name | Description | Latest <br/>Tested <br/>Version
|:-- | :-- | :--
|<a target="_blank" href="https://siddhi-io.github.io/siddhi-script-js">script-js</a> | Allows writing user defined JavaScript functions within Siddhi Applications to process events. |[5.0.2](https://mvnrepository.com/artifact/io.siddhi.extension.script.js/siddhi-script-js/5.0.2)

## Writing Custom Extensions

Custom extensions can be written in order to cater use case specific logics that are not by default available in Siddhi core, or in existing extensions.

The following Maven Archetypes can be used to generate the necessary Maven project to create the relevant extensions.

**Writing Execution Executions**

Maven archetype for execution execution that is used to generate the extension types such as:

* [Function](../query-guide/#function) extension, by extending `io.siddhi.core.executor.function.FunctionExecutor`.
* [Aggregate Function](../query-guide/#aggregate-function) extension, by extending `io.siddhi.core.query.selector.attribute.aggregator.AttributeAggregatorExecutor`.
* [Window](../query-guide/#window) extension, by extending `io.siddhi.core.query.processor.stream.window.WindowProcessor`.
* [Stream Function](../query-guide/#stream-function) extension, by extending `io.siddhi.core.query.processor.stream.function.StreamFunctionProcessor`.
* [Stream Processor](../query-guide/#stream-processor) extension, by extending `io.siddhi.core.query.processor.stream.StreamProcessor`.

The CLI command to generate the Maven project for the extension is as follows.

```
mvn archetype:generate
    -DarchetypeGroupId=io.siddhi.extension.archetype
    -DarchetypeArtifactId=siddhi-archetype-execution
    -DgroupId=io.siddhi.extension.execution
    -Dversion=1.0.0-SNAPSHOT
```

When the command is executed, the following properties will be prompted. At last, confirm that all the property values are correct by typing `Y` for yes, and `N` if they are not.  

|Property | Description | Mandatory | Default Value |
|------------- |-------------| ---- | ----- |
|_nameOfFunction | The name of the custom function (function, aggregate function, window, stream function, or stream processor) that is being created. | Yes | - |
|_nameSpaceOfFunction |The namespace of the function that groups similar custom functions. | Yes | - |
|groupIdPostfix | Postfix for the group ID. (As a convention, the function namespace is used). | No | `${_nameSpaceOfFunction}`|
|artifactId | Artifact ID for the project. | No | `siddhi-execution-${_nameSpaceOfFunction}`|
|classNameOfFunction|Class name of the Function.| No |`${_nameOfFunction}Function`|
|classNameOfAggregateFunction| Class name of the Aggregate Function. | No | `${_nameOfFunction}AggregateFunction`|
|classNameOfWindow|Class name of the Window.| No |`${_nameOfFunction}Window`|
|classNameOfStreamFunction|Class name of the Stream Function.| No |`${_nameOfFunction}StreamFunction`|
|classNameOfStreamProcessor|Class name of the Stream Processor.| No |`${_nameOfFunction}StreamProcessor`|

**Writing Input/Output Executions**

Maven archetype for input/output execution that is used to generate the extension types such as:

* [Source](../query-guide/#sink) extension, by extending `io.siddhi.core.stream.input.source.Source`.
* [Sink](../query-guide/#sink) extension, by extending  `io.siddhi.core.stream.output.sink.Sink`.

The CLI command to generate the Maven project for the extension is as follows.

```
mvn archetype:generate
    -DarchetypeGroupId=io.siddhi.extension.archetype
    -DarchetypeArtifactId=siddhi-archetype-io
    -DgroupId=io.siddhi.extension.io
    -Dversion=1.0.0-SNAPSHOT
```

When the command is executed, the following properties will be prompted. At last, confirm that all the property values are correct by typing `Y` for yes, and `N` if they are not.  

| Property | Description | Mandatory | Default Value |
| ------------- |-------------| ---- | ----- |
| _IOType | The name of the custom IO type that is being created. | Yes | - |
| groupIdPostfix | Postfix for the group ID. (As a convention, the name of the IO type is used). | No | `${_IOType}`|
| artifactId |  Artifact ID for the project. | No | `siddhi-io-${_IOType}`|
| classNameOfSink | Class name of the Sink. | No | `${_IOType}Sink`|
| classNameOfSource | Class name of the Source. | No | `${_IOType}Source`|

**Writing Data Mapping Executions**

Maven archetype for data mapping execution that is used to generate the extension types such as:

* [Source Mapper](../query-guide/#source-mapper) extension, by extending  `io.siddhi.core.stream.output.sink.SourceMapper`.
* [Sink Mapper](../query-guide/#sink-mapper) extension, by extending `io.siddhi.core.stream.output.sink.SinkMapper`.

The CLI command to generate the Maven project for the extension is as follows.  

```
mvn archetype:generate
    -DarchetypeGroupId=io.siddhi.extension.archetype
    -DarchetypeArtifactId=siddhi-archetype-map
    -DgroupId=io.siddhi.extension.map
    -Dversion=1.0.0-SNAPSHOT
```

When the command is executed, the following properties will be prompted. At last, confirm that all the property values are correct by typing `Y` for yes, and `N` if they are not.  

| Property | Description | Mandatory | Default Value |
| ------------- |-------------| ---- | ----- |
| _mapType |The name of the custom mapper type that is being created. | Yes | - |
| groupIdPostfix| Postfix for the group ID. (As a convention, the name of the mapper type is used). | No | `${_mapType}`|
| artifactId | Artifact ID of the project.| No | `siddhi-map-${_mapType}`|
| classNameOfSinkMapper | Class name of the Sink Mapper.| No | `${_mapType}SinkMapper`|
| classNameOfSourceMapper | Class name of the Source Mapper. | No | `${_mapType}SourceMapper`|   

**Writing Store Executions**

Maven archetype to generate [store](../query-guide/#store) extension, by extending either `io.siddhi.core.table.record.AbstractRecordTable` or `io.siddhi.core.table.record.AbstractQueryableRecordTable`. Here, the former allows Siddhi queries to perform conditional filters on the store while the latter allows performing both the conditional filters and select aggregations directly on the store.  

The CLI command to generate the Maven project for the extension is as follows.

```
mvn archetype:generate
   -DarchetypeGroupId=io.siddhi.extension.archetype
   -DarchetypeArtifactId=siddhi-archetype-store
   -DgroupId=io.siddhi.extension.store
   -Dversion=1.0.0-SNAPSHOT
```

When the command is executed, the following properties will be prompted. At last, confirm that all the property values are correct by typing `Y` for yes, and `N` if they are not.  

| Property | Description | Mandatory | Default Value |
| ------------- |-------------| ---- | ----- |
| _storeType | The name of the custom store that is being created. | Yes | - |
| groupIdPostfix| Postfix for the group ID. (As a convention, the name of the store type is used).| No | `${_storeType}`|
| artifactId | Artifact ID for the project. | No | `siddhi-store-${_storeType}` |
| className | Class name of the store. | No | `${_storeType}EventTable`|

**Writing Script Executions**

Maven archetype to generate [script](../query-guide/#script) extension, by extending either `io.siddhi.core.function.Script`.

The CLI command to generate the Maven project for the extension is as follows.

```
mvn archetype:generate
    -DarchetypeGroupId=io.siddhi.extension.archetype
    -DarchetypeArtifactId=siddhi-archetype-script
    -DgroupId=io.siddhi.extension.script
    -Dversion=1.0.0-SNAPSHOT
```

When the command is executed, the following properties will be prompted. At last, confirm that all the property values are correct by typing `Y` for yes, and `N` if they are not.  

| Property | Description | Mandatory | Default Value |
| ------------- |-------------| ---- | ----- |
| _nameOfScript | The name of the custom script that is being created. | Yes | - |
| groupIdPostfix| Postfix for the group ID. (As a convention, the name of the script type is used). | No | `${_nameOfScript}`|
| artifactId | Artifact ID for the project. | No | `siddhi-script-${_nameOfScript}` |
| classNameOfScript | Class name of the Script. | No | `Eval${_nameOfScript}` |


# Siddhi 5.1 Streaming SQL Guide

## Introduction

Siddhi Streaming SQL is designed to process streams of events. It can be used to
implement streaming data integration, streaming analytics, rule based and
adaptive decision making use cases.
It is an evolution of Complex Event Processing (CEP) and Stream Processing
systems, hence it can also be used to process stateful computations, detecting
of complex event patterns, and sending notifications in real-time.

Siddhi Streaming SQL uses SQL like syntax, and annotations to consume events
from diverse event sources with various data formats, process then using
stateful and stateless operators and send outputs to multiple endpoints
according to their accepted event formats. It also supports exposing rule based
and adaptive decision making as service endpoints such that external programs
and systems can synchronously get decision support form Siddhi.  

The following sections explains how to write event processing logic using Siddhi Streaming SQL.

## Siddhi Application
The processing logic for your program can be written using the Streaming SQL and
put together as a single file with `.siddhi` extension. This file is called as
the `Siddhi Application` or the `SiddhiApp`.

SiddhiApps are named by adding `@app:name('<name>')` annotation on the top of the SiddhiApp file.
When the annotation is not added Siddhi assigns a random UUID as the name of the SiddhiApp.

**Purpose**

SiddhiApp provides an isolated execution environment for your processing logic that allows you to
deploy and execute processing logic independent of other SiddhiApp in the system.
Therefore it's always recommended to have a processing logic related to single
use case in a single SiddhiApp. This will help you to group
processing logic and easily manage addition and removal of various use cases.

!!! tip "Have different business use cases in separate Siddhi Applications."
    This is recommended as it allows users to selectively deploy the applications based their on business needs.
    It is also recommended to move the repeated steam processing logic that exist in multiple Siddhi Applications such as message retrieval and preprocessing, to a common Siddhi Application, whereby reducing code duplication and improving maintainability.
    In this case, to pass the events from one Siddhi App to another, configure them using a common topic using [In-Memory Sink](../api/latest/#inmemory-sink) and [In-Memory Source](../api/latest/#inmemory-source).

The following diagram depicts some of the key Siddhi Streaming SQL elements of Siddhi Application and
how **event flows** through the elements.

![Event Flow](../images/event-flow.png?raw=true "Event Flow")

Below table provides brief description of a few key elements in the Siddhi Streaming SQL Language.

| Elements     | Description |
| ------------- |-------------|
| Stream    | A logical series of events ordered in time with a uniquely identifiable name, and a defined set of typed attributes defining its schema. |
| Event     | An event is a single event object associated with a stream. All events of a stream contains a timestamp and an identical set of typed attributes based on the schema of the stream they belong to.|
| Table     | A structured representation of data stored with a defined schema. Stored data can be backed by `In-Memory`, or external data stores such as `RDBMS`, `MongoDB`, etc. The tables can be accessed and manipulated at runtime.
| Named-Window     | A structured representation of data stored with a defined schema and eviction policy. Window data is stored `In-Memory` and automatically cleared by the named-window constrain. Other siddhi elements can only query the values in windows at runtime but they cannot modify them.
| Named-Aggregation     | A structured representation of data that's incrementally aggregated and stored with a defined schema and aggregation granularity such as seconds, minutes, hours, etc. Aggregation data is stored both `In-Memory` and in external data stores such as `RDBMS`. Other siddhi elements can only query the values in windows at runtime but they cannot modify them.
| Query	    | A logical construct that processes events in streaming manner by by consuming data from one or more streams, tables, windows and aggregations, and publishes output events into a stream, table or a window.
| Source    | A construct that consumes data from external sources (such as `TCP`, `Kafka`, `HTTP`, etc) with various event formats such as `XML`, `JSON`, `binary`, etc, convert then to Siddhi events, and passes into streams for processing.
| Sink      | A construct that consumes events arriving at a stream, maps them to a predefined data format (such as `XML`, `JSON`, `binary`, etc), and publishes them to external endpoints (such as `E-mail`, `TCP`, `Kafka`, `HTTP`, etc).
| Input Handler | A mechanism to programmatically inject events into streams. |
| Stream/Query Callback | A mechanism to programmatically consume output events from streams or queries. |
| Partition	| A logical container that isolates the processing of queries based on the partition keys derived from the events.
| Inner Stream | A positionable stream that connects portioned queries with each other within the partition.

**Grammar**

SiddhiApp is a collection of Siddhi Streaming SQL elements composed together as a script.
Here each Siddhi element must be separated by a semicolon `;`.

Hight level syntax of SiddhiApp is as follows.

```
<siddhi app>  :
        <app annotation> *
        ( <stream definition> | <table definition> | ... ) +
        ( <query> | <partition> ) +
        ;
```

**Example**

Siddhi Application with name `Temperature-Analytics` defined with a stream named `TempStream` and a query
named `5minAvgQuery`.

```siddhi
@app:name('Temperature-Analytics')

define stream TempStream (deviceID long, roomNo int, temp double);

@info(name = '5minAvgQuery')
from TempStream#window.time(5 min)
select roomNo, avg(temp) as avgTemp
  group by roomNo
insert into OutputStream;
```

## Stream

A stream is a logical series of events ordered in time. Its schema is defined via the **stream definition**.

A stream definition contains the stream name and a set of attributes having a specific type and a uniquely identifiable name within the scope of the stream. All events associated with the stream will have the same schema (i.e., have the same attributes in the same order).

**Purpose**

Stream groups common types of events together with a schema. This helps in various ways such as, processing all events in queries together and performing data format transformations together when they are consumed and published via sources and sinks.

**Syntax**

The syntax for defining a stream is as follows.

```siddhi
define stream <stream name> (<attribute name> <attribute type>,
                             <attribute name> <attribute type>, ... );
```

The following parameters are used to configure a stream definition.

| Parameter     | Description |
| ------------- |-------------|
| `<stream name>`      | The name of the stream created. (It is recommended to define a stream name in `PascalCase`.) |
| `<attribute name>`   | Uniquely identifiable name of the stream attribute. (It is recommended to define attribute names in `camelCase`.)|    
| `<attribute type>`   | The type of each attribute defined in the schema. <br/> This can be `STRING`, `INT`, `LONG`, `DOUBLE`, `FLOAT`, `BOOL` or `OBJECT`.     |

To use and refer stream and attribute names that do not follow `[a-zA-Z_][a-zA-Z_0-9]*` format enclose them in ``` ` ```. E.g. ``` `$test(0)` ```.

To make the stream process events in multi-threading and asynchronous way use the `@async` annotation as shown in
[Threading and synchronization](#threading-and-synchronization) configuration section.

**Example**
```siddhi
define stream TempStream (deviceID long, roomNo int, temp double);
```
The above creates a stream with name `TempStream` having the following attributes.

+ `deviceID` of type `long`
+ `roomNo` of type `int`
+ `temp` of type `double`


### Source

Sources receive events via multiple transports and in various data formats, and direct them into streams for processing.

A source configuration allows to define a mapping in order to convert each incoming event from its native data format to a Siddhi event. When customizations to such mappings are not provided, Siddhi assumes that the arriving event adheres to the predefined format based on the stream definition and the configured message mapping type.

**Purpose**

Source provides a way to consume events from external systems and convert them to be processed by the associated stream.


**Syntax**

To configure a stream that consumes events via a source, add the source configuration to a stream definition by adding the `@source` annotation with the required parameter values.

The source syntax is as follows:

```siddhi
@source(type='<source type>', <static.key>='<value>', <static.key>='<value>',
    @map(type='<map type>', <static.key>='<value>', <static.key>='<value>',
        @attributes( <attribute1>='<attribute mapping>', <attributeN>='<attribute mapping>')
    )
)
define stream <stream name> (<attribute1> <type>, <attributeN> <type>);
```

This syntax includes the following annotations.

**Source**

The `type` parameter of `@source` annotation defines the source type that receives events.
The other parameters of `@source` annotation depends upon the selected source type, and here
some of its parameters can be optional.

For detailed information about the supported parameters see the documentation of the relevant source.

The following is the list of source types supported by Siddhi:

|Source type | Description|
| ------------- |-------------|
| <a target="_blank" href="../api/latest/#inmemory-source">In-memory</a> | Allow SiddhiApp to consume events from other SiddhiApps running on the same JVM. |
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-io-http/">HTTP</a> | Expose an HTTP service to consume messages.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-io-kafka/">Kafka</a> | Subscribe to Kafka topic to consume events.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-io-tcp/">TCP</a> | Expose a TCP service to consume messages.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-io-email/">Email</a> | Consume emails via POP3 and IMAP protocols.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-io-jms/">JMS</a> | Subscribe to JMS topic or queue to consume events.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-io-file/">File</a> | Reads files by tailing or as a whole to extract events out of them.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-io-cdc/">CDC</a> | Perform change data capture on databases.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-io-prometheus/">Prometheus</a> | Consume data from Prometheus agent.|

 [In-memory](../api/latest/#inmemory-source) is the only source inbuilt in Siddhi, and all other source types are implemented as extensions.   

#### Source Mapper

Each `@source` configuration can have a mapping denoted by the `@map` annotation that defines how to convert the incoming event
format to Siddhi events.

The `type` parameter of the `@map` defines the map type to be used in converting the incoming events. The other parameters
of `@map` annotation depends on the mapper selected, and some of its parameters can be optional.

For detailed information about the parameters see the documentation of the relevant mapper.

**Map Attributes**

`@attributes` is an optional annotation used with `@map` to define custom mapping. When `@attributes` is not provided, each mapper
assumes that the incoming events adheres to its own default message format and attempt to convert the events from that format.
By adding the `@attributes` annotation, users can selectively extract data from the incoming message and assign them to the attributes.

There are two ways to configure `@attributes`.

1. Define attribute names as keys, and mapping configurations as values:<br/>
  `@attributes( <attribute1>='<mapping>', <attributeN>='<mapping>')`

2. Define the mapping configurations in the same order as the attributes defined in stream definition:<br/>
  `@attributes( '<mapping for attribute1>', '<mapping for attributeN>')`

**Supported source mapping types**

The following is the list of source mapping types supported by Siddhi:

|Source mapping type | Description|
| ------------- |-------------|
| <a target="_blank" href="../api/latest/#passthrough-source-mapper">PassThrough</a> | Omits data conversion on Siddhi events.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-map-json/">JSON</a> | Converts JSON messages to Siddhi events.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-map-xml/">XML</a> | Converts XML messages to Siddhi events.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-map-text/">TEXT</a> | Converts plain text messages to Siddhi events.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-map-avro/">Avro</a> | Converts Avro events to Siddhi events.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-map-binary/">Binary</a> | Converts Siddhi specific binary events to Siddhi events.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-map-keyvalue/">Key Value</a> | Converts key-value HashMaps to Siddhi events.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-map-csv/">CSV</a> | Converts CSV like delimiter separated events to Siddhi events.|

!!! tip
    When the `@map` annotation is not provided `@map(type='passThrough')` is used as default, that passes the consumed Siddhi events directly to the streams without any data conversion.

 [PassThrough](../api/latest/#passthrough-source-mapper) is the only source mapper inbuilt in Siddhi, and all other source mappers are implemented as extensions.

**Example 1**

Receive `JSON` messages by exposing an `HTTP` service, and direct them to `InputStream` stream for processing.
Here the `HTTP` service will be secured with basic authentication, receives events on all network interfaces on port `8080` and context `/foo`. The service expects the `JSON` messages to be on the default data format that's supported by the `JSON` mapper as follows.

```json
{
   "event":{
       "name":"Paul",
       "age":20,
       "country":"UK"
   }
}
```

The configuration of the `HTTP` source and `JSON` source mapper to achieve the above is as follows.

```siddhi
@source(type='http', receiver.url='http://0.0.0.0:8080/foo',
  @map(type='json'))
define stream InputStream (name string, age int, country string);
```

**Example 2**

Receive `JSON` messages by exposing an `HTTP` service, and direct them to `StockStream` stream for processing.
Here the incoming `JSON`, as given below, do not adhere to the default data format that's supported by the `JSON` mapper.

```json
{
  "portfolio":{
    "stock":{
      "volume":100,
      "company":{
        "symbol":"FB"
      },
      "price":55.6
    }
  }
}
```

The configuration of the `HTTP` source and the custom `JSON` source mapping to achieve the above is as follows.

```siddhi
@source(type='http', receiver.url='http://0.0.0.0:8080/foo',
  @map(type='json', enclosing.element="$.portfolio",
    @attributes(symbol = "stock.company.symbol", price = "stock.price",
                volume = "stock.volume")))
define stream StockStream (symbol string, price float, volume long);
```

The same can also be configured by omitting the attribute names as below.

```siddhi
@source(type='http', receiver.url='http://0.0.0.0:8080/foo',
  @map(type='json', enclosing.element="$.portfolio",
    @attributes("stock.company.symbol", "stock.price", "stock.volume")))
define stream StockStream (symbol string, price float, volume long);
```

### Sink

Sinks consumes events from streams and publish them via multiple transports to external endpoints in various data formats.

A sink configuration allows users to define a mapping to convert the Siddhi events in to the required output data format (such as `JSON`, `TEXT`, `XML`, etc.) and publish the events to the configured endpoints. When customizations to such mappings are not provided, Siddhi converts events to the predefined event format based on the stream definition and the configured mapper type, before publishing the events.

**Purpose**

Sink provides a way to publish Siddhi events of a stream to external systems by converting events to their supported format.

**Syntax**

To configure a stream to publish events via a sink, add the sink configuration to a stream definition by adding the `@sink`
annotation with the required parameter values.

The sink syntax is as follows:

```siddhi
@sink(type='<sink type>', <static.key>='<value>', <dynamic.key>='{{<value>}}',
    @map(type='<map type>', <static.key>='<value>', <dynamic.key>='{{<value>}}',
        @payload('<payload mapping>')
    )
)
define stream <stream name> (<attribute1> <type>, <attributeN> <type>);
```

!!! Note "Dynamic Properties"
    The sink and sink mapper properties that are categorized as `dynamic` have the ability to absorb attribute values
    dynamically from the Siddhi events of their associated streams. This can be configured by enclosing the relevant
    attribute names in double curly braces as`{{...}}`, and using it within the property values.

    Some valid dynamic properties values are:

    * `'{{attribute1}}'`
    * `'This is {{attribute1}}'`
    * `{{attribute1}} > {{attributeN}}`  

    Here the attribute names in the double curly braces will be replaced with the values from the events before they are published.

This syntax includes the following annotations.

**Sink**

The `type` parameter of the `@sink` annotation defines the sink type that publishes the events.
The other parameters of the `@sink` annotation depends upon the selected sink type, and here
some of its parameters can be optional and/or dynamic.

For detailed information about the supported parameters see documentation of the relevant sink.

The following is a list of sink types supported by Siddhi:

|Source type | Description|
| ------------- |-------------|
| <a target="_blank" href="../api/latest/#inmemory-sink">In-memory</a> | Allow SiddhiApp to publish events to other SiddhiApps running on the same JVM. |
| <a target="_blank" href="../api/latest/#log-sink">Log</a>| Logs the events appearing on the streams. |
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-io-http/">HTTP</a> | Publish events to an HTTP endpoint.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-io-kafka/">Kafka</a> | Publish events to Kafka topic. |
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-io-tcp/">TCP</a> | Publish events to a TCP service. |
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-io-email/">Email</a> | Send emails via SMTP protocols.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-io-jms/">JMS</a> | Publish events to JMS topics or queues. |
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-io-file/">File</a> | Writes events to files.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-io-prometheus/">Prometheus</a> | Expose data through Prometheus agent.|

#### Distributed Sink

Distributed Sinks publish events from a defined stream to multiple endpoints using load balancing or partitioning strategies.

Any sink can be used as a distributed sink. A distributed sink configuration allows users to define a common mapping to convert
and send the Siddhi events for all its destination endpoints.

**Purpose**

Distributed sink provides a way to publish Siddhi events to multiple endpoints in the configured event format.

**Syntax**

To configure distributed sink add the sink configuration to a stream definition by adding the `@sink`
annotation and add the configuration parameters that are common of all the destination endpoints inside it,
along with the common parameters also add the `@distribution` annotation specifying the distribution strategy (i.e. `roundRobin` or `partitioned`) and `@destination` annotations providing each endpoint specific configurations.

The distributed sink syntax is as follows:

**_RoundRobin Distributed Sink_**

Publishes events to defined destinations in a round robin manner.

```siddhi
@sink(type='<sink type>', <common.static.key>='<value>', <common.dynamic.key>='{{<value>}}',
    @map(type='<map type>', <static.key>='<value>', <dynamic.key>='{{<value>}}',
        @payload('<payload mapping>')
    )
    @distribution(strategy='roundRobin',
        @destination(<destination.specific.key>='<value>'),
        @destination(<destination.specific.key>='<value>')))
)
define stream <stream name> (<attribute1> <type>, <attributeN> <type>);
```

**_Partitioned Distributed Sink_**

Publish events to the defined destinations by partitioning them based on a partitioning key.

```siddhi
@sink(type='<sink type>', <common.static.key>='<value>', <common.dynamic.key>='{{<value>}}',
    @map(type='<map type>', <static.key>='<value>', <dynamic.key>='{{<value>}}',
        @payload('<payload mapping>')
    )
    @distribution(strategy='partitioned', partitionKey='<partition key>',
        @destination(<destination.specific.key>='<value>'),
        @destination(<destination.specific.key>='<value>')))
)
define stream <stream name> (<attribute1> <type>, <attributeN> <type>);
```

#### Sink Mapper

Each `@sink` configuration can have a mapping denoted by the `@map` annotation that defines how to convert Siddhi events to outgoing messages with the defined format.

The `type` parameter of the `@map` defines the map type to be used in converting the outgoing events, and other parameters of `@map` annotation depend on the mapper selected, where some of these parameters can be optional and/or dynamic.

For detailed information about the parameters see the documentation of the relevant mapper.

**Map Payload**

`@payload` is an optional annotation used with `@map` to define custom mapping. When the `@payload` annotation is not provided, each mapper maps the outgoing events to its own default event format. The `@payload` annotation allow users to configure mappers to produce the output payload of their choice, and by using dynamic properties within the payload they can selectively extract and add data from the published Siddhi events.

There are two ways you to configure `@payload` annotation.

1. Some mappers such as `XML`, `JSON`, and `Test` only accept one output payload: <br/>
  `@payload( 'This is a test message from {{user}}.')`
2. Some mappers such `key-value` accept series of mapping values: <br/>
  `@payload( key1='mapping_1', 'key2'='user : {{user}}')` <br/>
  Here, the keys of payload mapping can be defined using the dot notation as ```a.b.c```, or using any constant string value as `'$abc'`.

**Supported sink mapping types**

The following is a list of sink mapping types supported by Siddhi:

|Sink mapping type | Description|
| ------------- |-------------|
| <a target="_blank" href="../api/latest/#passthrough-sink-mapper">PassThrough</a> | Omits data conversion on outgoing Siddhi events.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-map-json/">JSON</a> | Converts Siddhi events to JSON messages.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-map-xml/">XML</a> | Converts Siddhi events to XML messages.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-map-text/">TEXT</a> | Converts Siddhi events to plain text messages.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-map-avro/">Avro</a> | Converts Siddhi events to Avro Events.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-map-binary/">Binary</a> | Converts Siddhi events to Siddhi specific binary events.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-map-keyvalue/">Key Value</a> | Converts Siddhi events to key-value HashMaps.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-map-csv/">CSV</a> | Converts Siddhi events to CSV like delimiter separated events.|

!!! tip
    When the `@map` annotation is not provided `@map(type='passThrough')` is used as default, that passes the outgoing Siddhi events directly to the sinks without any data conversion.

 [PassThrough](../api/latest/#passthrough-sink-mapper) is the only sink mapper inbuilt in Siddhi, and all other sink mappers are implemented as extensions.

**Example 1**

Sink to publish `OutputStream` events by converting them to `JSON` messages with the default format, and by sending to an `HTTP` endpoint `http://localhost:8005/endpoint1`, using `POST` method, `Accept` header, and basic authentication having `admin` is both username and password.

The configuration of the `HTTP` sink and `JSON` sink mapper to achieve the above is as follows.

```siddhi
@sink(type='http', publisher.url='http://localhost:8005/endpoint',
      method='POST', headers='Accept-Date:20/02/2017',
      basic.auth.enabled='true', basic.auth.username='admin',
      basic.auth.password='admin',
      @map(type='json'))
define stream OutputStream (name string, age int, country string);
```

This will publish a `JSON` message on the following format:
```json
{
  "event":{
    "name":"Paul",
    "age":20,
    "country":"UK"
  }
}
```

**Example 2**

Sink to publish `StockStream` events by converting them to user defined `JSON` messages, and sending them to an `HTTP` endpoint `http://localhost:8005/stocks`.

The configuration of the `HTTP` sink and custom `JSON` sink mapping to achieve the above is as follows.

```siddhi
@sink(type='http', publisher.url='http://localhost:8005/stocks',
      @map(type='json', validate.json='true', enclosing.element='$.Portfolio',
           @payload("""{"StockData":{ "Symbol":"{{symbol}}", "Price":{{price}} }}""")))
define stream StockStream (symbol string, price float, volume long);
```

This will publish a single event as the `JSON` message on the following format:

```json
{
  "Portfolio":{
    "StockData":{
      "Symbol":"GOOG",
      "Price":55.6
    }
  }
}
```
This can also publish multiple events together as a `JSON` message on the following format:

```json
{
  "Portfolio":[
    {
      "StockData":{
        "Symbol":"GOOG",
        "Price":55.6
      }
    },
    {
      "StockData":{
        "Symbol":"FB",
        "Price":57.0
      }
    }
  ]  
}
```

**Example 3**

Sink to publish events from the `OutputStream` stream to multiple `HTTP` endpoints using a partitioning strategy. Here, the events are sent to either `http://localhost:8005/endpoint1` or `http://localhost:8006/endpoint2` based on the partitioning key `country`. It uses default `JSON` mapping, `POST` method, and `admin` as both the username and the password when publishing to both the endpoints.

The configuration of the distributed `HTTP` sink and `JSON` sink mapper to achieve the above is as follows.

```siddhi
@sink(type='http', method='POST', basic.auth.enabled='true',
      basic.auth.username='admin', basic.auth.password='admin',
      @map(type='json'),
      @distribution(strategy='partitioned', partitionKey='country',
        @destination(publisher.url='http://localhost:8005/endpoint1'),
        @destination(publisher.url='http://localhost:8006/endpoint2')))
define stream OutputStream (name string, age int, country string);
```

This will partition the outgoing events and publish all events with the same country attribute value to the same endpoint. The `JSON` message published will be on the following format:
```json
{
  "event":{
    "name":"Paul",
    "age":20,
    "country":"UK"
  }
}
```

### Error Handling

Errors in Siddhi can be handled at the Streams and in Sinks.

**_Error Handling at Stream_**

When errors are thrown by Siddhi elements subscribed to the stream, the error gets propagated up to the stream that delivered the event to those Siddhi elements. By default the error is logged and dropped at the stream, but this behavior can be altered by by adding `@OnError` annotation to the corresponding stream definition.
`@OnError` annotation can help users to capture the error and the associated event, and handle them gracefully by sending them to a fault stream.

The `@OnError` annotation and the required `action` to be specified as below.

```siddhi
@OnError(action='on error action')
define stream <stream name> (<attribute name> <attribute type>,
                             <attribute name> <attribute type>, ... );
```

The `action` parameter of the `@OnError` annotation defines the action to be executed during failure scenarios.
The following actions can be specified to `@OnError` annotation to handle erroneous scenarios.

* `LOG` : Logs the event with the error, and drops the event. This is the default action performed even when `@OnError` annotation is not defined.
* `STREAM`: Creates a fault stream and redirects the event and the error to it. The created fault stream will have all the attributes defined in the base stream to capture the error causing event, and in addition it also contains `_error` attribute of type `object` to containing the error information. The fault stream can be referred by adding `!` in front of the base stream name as `!<stream name>`.

**Example**

Handle errors in `TempStream` by redirecting the errors to a fault stream.

The configuration of `TempStream` stream and `@OnError` annotation is as follows.

```siddhi
@OnError(action='STREAM')
define stream TempStream (deviceID long, roomNo int, temp double);
```

Siddhi will infer and automatically defines the fault stream of `TempStream` as given below.


```siddhi
define stream !TempStream (deviceID long, roomNo int, temp double, _error object);
```

The SiddhiApp extending the above the use-case by adding failure generation and error handling with the use of [queries](#query) is as follows.

Note: Details on writing processing logics via [queries](#query) will be explained in later sections.

```siddhi
-- Define fault stream to handle error occurred at TempStream subscribers
@OnError(action='STREAM')
define stream TempStream (deviceID long, roomNo int, temp double);

-- Error generation through a custom function `createError()`
@info(name = 'error-generation')
from TempStream#custom:createError()
insert into IgnoreStream1;

-- Handling error by simply logging the event and error.
@info(name = 'handle-error')
from !TempStream#log("Error Occurred!")
select deviceID, roomNo, temp, _error
insert into IgnoreStream2;
```

**_Error Handling at Sink_**

There can be cases where external systems becoming unavailable or coursing errors when the events are published to them. By default sinks log and drop the events causing event losses, and this can be handled gracefully by configuring `on.error` parameter of the `@sink` annotation.

The `on.error` parameter of the `@sink` annotation can be specified as below.

```siddhi
@sink(type='<sink type>', on.error='<on error action>', <key>='<value>', ...)
define stream <stream name> (<attribute name> <attribute type>,
                             <attribute name> <attribute type>, ... );
```  

The following actions can be specified to `on.error` parameter of `@sink` annotation to handle erroneous scenarios.

* `LOG` : Logs the event with the error, and drops the event. This is the default action performed even when `on.error` parameter is not defined on the `@sink` annotation.
* `WAIT` : Publishing threads wait in `back-off and re-trying` mode, and only send the events when the connection is re-established. During this time the threads will not consume any new messages causing the systems to introduce back pressure on the systems that publishes to it.
* `STREAM`: Pushes the failed events with the corresponding error to the associated fault stream the sink belongs to.

**Example 1**

Introduce back pressure on the threads who bring events via `TempStream` when the system cannot connect to Kafka.

The configuration of `TempStream` stream and `@sink` Kafka annotation with `on.error` property is as follows.

```siddhi
@sink(type='kafka', on.error='WAIT', topic='{{roomNo}}',
      bootstrap.servers='localhost:9092',
      @map(type='xml'))
define stream TempStream (deviceID long, roomNo int, temp double);
```

**Example 2**

Send events to the fault stream of `TempStream` when the system cannot connect to Kafka.

The configuration of `TempStream` stream with associated fault stream, `@sink` Kafka annotation with `on.error` property and a [queries](#query) to handle the error is as follows.

Note: Details on writing processing logics via [queries](#query) will be explained in later sections.

```siddhi
@OnError(action='STREAM')
@sink(type='kafka', on.error='STREAM', topic='{{roomNo}}',
      bootstrap.servers='localhost:9092',
      @map(type='xml'))
define stream TempStream (deviceID long, roomNo int, temp double);

-- Handling error by simply logging the event and error.
@info(name = 'handle-error')
from !TempStream#log("Error Occurred!")
select deviceID, roomNo, temp, _error
insert into IgnoreStream;
```

## Query

Query defines the processing logic in Siddhi. It consumes events from one or more streams, [named-windows](#named-window), [tables](#table), and/or [named-aggregations](#named-aggregation), process the events in a streaming manner, and generate output events into a [stream](#stream), [named-window](#named-window), or [table](#table).

**Purpose**

A query provides a way to process the events in the order they arrive and produce output using both stateful and stateless complex event processing and stream processing operations.

**Syntax**

The high level query syntax for defining processing logics is as follows:

```siddhi
@info(name = '<query name>')
from <input>
<projection>
<output action>
```
The following parameters are used to configure a stream definition.

| Parameter&nbsp;&nbsp;&nbsp;&nbsp;| Description |
|----------------|-------------|
| `<query name>`   | The name of the query. Since naming the query (i.e the `@info(name = '<query name>')` annotation) is optional, when the name is not provided Siddhi assign a system generated name for the query. |
| `<input>`        | Defines the means of event consumption via [streams](#stream), [named-windows](#named-window), [tables](#table), and/or [named-aggregations](#named-aggregations), and defines the processing logic using [filters](#filter), [windows](#window), [stream-functions](#stream-function), [joins](#join), [patterns](#pattern) and [sequences](#sequence). |
| `<projection>`   | Generates output event attributes using [select](#select), [functions](#function), [aggregation-functions](#aggregation-function), and [group by](#group-by) operations, and filters the generated the output using [having](#having), [limit & offset](#limit-offset), [order by](#order-by), and [output rate limiting](#output-rate-limiting) operations before sending them out. Here the projection is optional and when it is omitted all the input events will be sent to the output as it is. |
| `<output action>`| Defines output action (such as `insert into`, `update`, `delete`, etc) that needs to be performed by the generated events on a [stream](#stream), [named-window](#named-window), or [table](#table)  |

## From

All Siddhi queries must always have at least one [stream](#stream) or [named-window](#named-window) as an input (some queries can consume more than one [stream](#stream) or [named-window](#named-window)), and only [join](#join) query can consume events via [tables](#table), or [named-aggregations](#named-aggregations) as the second input.

The input [stream](#stream), [named-window](#named-window), [table](#table), and/or [named-aggregation](#named-aggregations) should be defined before they can be used in a query.

**Syntax**

A high level syntax for consuming events from a stream, named-window, table, and/or named-aggregation is as follow;

```siddhi
from ((<stream>|<named-window>)<handler>*) ((join (<stream>|<named-window>|<table>|<named-aggregation>)<handler>*)|((,|->)(<stream>|<named-window>)<handler>*)+)?
<projection>
insert into (<stream>|<named-window>|<table>)
```

Here the `<handler>` denotes the processing logic using [filters](#filter), [windows](#window), and [stream-functions](#stream-function), `join` for  [joins](#join), `->` for [patterns](#pattern), and `,` for[sequences](#sequence).

More information on writing queries used these will be discussed in later sections.

## Insert

Allows events to be inserted directly into [streams](#stream), [named-windows](#named-window), or [tables](#table).

When a query is defined to insert events into a stream that is not already defined, Siddhi infers and automatically defines its stream definition, such that queries defined below the current query can use the stream like any other predefined streams.

**Syntax**

Syntax to insert events into a stream, named-window or table from another stream is as follows;

```siddhi
from <input>
<projection>
insert into (<stream>|<named-window>|<table>)
```

This inserts all the newly arrived events (`current events`) in to a stream, named-window, or table. There are also other types of events other than `current events` that are produced by queries, the [Event Type](#event-type) section provides more information on, how insertion operation can be modified to support those.

**Example**

A query to consume events from the `TempStream` stream and output only the `roomNo` and `temp` attributes to the `RoomTempStream` stream, from which another query to consume the events and send all its attributes to `AnotherRoomTempStream` stream.

```siddhi
define stream TempStream (deviceID long, roomNo int, temp double);

from TempStream
select roomNo, temp
insert into RoomTempStream;

from RoomTempStream
insert into AnotherRoomTempStream;
```

!!! tip "Inferred Stream"
    Here, the `RoomTempStream` and `AnotherRoomTempStream` streams are an inferred streams, which means their stream definitions are inferred from the queries and hence they can be used the same as any other defined streams without any restrictions.  

###Value

Values are typed data, which can be manipulated, transferred, and stored. Values can be referred by the attributes defined in definitions such as streams, and tables.

Siddhi supports values of type `STRING`, `INT` (Integer), `LONG`, `DOUBLE`, `FLOAT`, `BOOL` (Boolean) and `OBJECT`.
The syntax of each type and their example use as a constant value is as follows,

<table style="width:100%">
    <tr>
        <th style="width:10%">Attribute Type</th>
        <th style="width:50%">Format</th>
        <th style="width:40%">Example</th>
    </tr>
    <tr>
        <td>int</td>
        <td><code>&ltdigit&gt+</code></td>
        <td><code>123</code>, <code>-75</code>, <code>+95</code></td>
    </tr>
    <tr>
        <td>long</td>
        <td><code>&ltdigit&gt+L</code></td>
        <td><code>123000L</code>, <code>-750l</code>, <code>+154L</code></td>
    </tr>
    <tr>
        <td>float</td>
        <td><code>(&ltdigit&gt+)?('.'&ltdigit&gt*)?<br/>(E(-|+)?&ltdigit&gt+)?F</code></td>
        <td><code>123.0f</code>, <code>-75.0e-10F</code>,<br/><code>+95.789f</code></td>
    </tr>
    <tr>
        <td>double</td>
        <td><code>(&ltdigit&gt+)?('.'&ltdigit&gt*)?<br/>(E(-|+)?&ltdigit&gt+)?D?</code></td>
        <td><code>123.0</code>,<code>123.0D</code>,<br/><code>-75.0e-10D</code>,<code>+95.789d</code></td>
    </tr>
    <tr>
        <td>bool</td>
        <td><code>(true|false)</code></td>
        <td><code>true</code>, <code>false</code>, <code>TRUE</code>, <code>FALSE</code></td>
    </tr>
    <tr>
        <td>string</td>
        <td><code>'(&lt;char&gt;* !('|"|"""|&ltnew line&gt))'</code> or <br/> <code>"(&lt;char&gt;* !("|"""|&ltnew line&gt))"</code> or <br/><code>"""(&lt;char&gt;* !("""))"""</code> </td>
        <td><code>'Any text.'</code>, <br/><code>"Text with 'single' quotes."</code>, <br/><pre>"""
Text with 'single' quotes,
"double" quotes, and new lines.
"""</pre></td>
    </tr>
</table>

**_Time_**

Time is a special type of `LONG` value that denotes time using digits and their unit in the format `(<digit>+ <unit>)+`. At execution, the `time` gets converted into **milliseconds** and returns a `LONG` value.

<table style="width:100%">
    <tr>
        <th>
            Unit  
        </th>
        <th>
            Syntax
        </th>
    </tr>
    <tr>
        <td>
            Year
        </td>
        <td>
            <code>year</code> | <code>years</code>
        </td>
    </tr>
    <tr>
        <td>
            Month
        </td>
        <td>
            <code>month</code> | <code>months</code>
        </td>
    </tr>
    <tr>
        <td>
            Week
        </td>
        <td>
            <code>week</code> | <code>weeks</code>
        </td>
    </tr>
    <tr>
        <td>
            Day
        </td>
        <td>
            <code>day</code> | <code>days</code>
        </td>
    </tr>
    <tr>
        <td>
            Hour
        </td>
        <td>
           <code>hour</code> | <code>hours</code>
        </td>
    </tr>
    <tr>
        <td>
           Minutes
        </td>
        <td>
           <code>minute</code> | <code>minutes</code> | <code>min</code>
        </td>
    </tr>
    <tr>
        <td>
           Seconds
        </td>
        <td>
           <code>second</code> | <code>seconds</code> | <code>sec</code>
        </td>
    </tr>
    <tr>
        <td>
           Milliseconds
        </td>
        <td>
           <code>millisecond</code> | <code>milliseconds</code>
        </td>
    </tr>
</table>

**Example**

1 hour and 25 minutes can by written as `1 hour and 25 minutes` which is equal to the `LONG` value `5100000`.

###Select

The select clause in Siddhi query defines the output event attributes of the query. Following are some basic query projection operations supported by select.

<table style="width:100%">
    <tr>
        <th>Action</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Select specific attributes for projection</td>
        <td>Only select some of the input attributes as query output attributes.
            <br><br>
            E.g., Select and output only <code>roomNo</code> and <code>temp</code> attributes from the <code>TempStream</code> stream.
            <pre style="align:left">from TempStream<br>select roomNo, temp<br>insert into RoomTempStream;</pre>
        </td>
    </tr>
    <tr>
        <td>Select all attributes for projection</td>
        <td>Select all input attributes as query output attributes. This can be done by using asterisk (<code> * </code>) or by omitting the <code>select</code> clause itself.
            <br><br>
            E.g., Both following queries select all attributes of <code>TempStream</code> input stream and output all attributes to <code>NewTempStream</code> stream.
            <pre>from TempStream<br/>select * <br/>insert into NewTempStream;</pre>
            or
            <pre>from TempStream<br/>insert into NewTempStream;</pre>
        </td>
    </tr>
    <tr>
        <td>Name attribute</td>
        <td>Provide a unique name for each output attribute generated by the query. This can help to rename the selected input attributes or assign an attribute name to a projection operation such as function, aggregate-function, mathematical operation, etc, using <code>as</code> keyword.
            <br/><br/>
            E.g., Query that renames input attribute <code>temp</code> to <code>temperature</code> and function <code>currentTimeMillis()</code> as <code>time</code>.
            <pre>from TempStream <br/>select roomNo, temp as temperature, currentTimeMillis() as time</br>insert into RoomTempStream;</pre>
        </td>
    </tr>
    <tr>
        <td>Constant values as attributes</td>
        <td>Creates output attributes with a constant value.
            <br></br>
            Any constant value of type <code>STRING</code>, <code>INT</code>, <code>LONG</code>, <code>DOUBLE</code>, <code>FLOAT</code>, <code>BOOL</code>, and <code>time</code> as given in the <a href="#value">values section</a> can be defined.
            </br>
            E.g., Query specifying <code>'C'</code> as the constant value for the <code>scale</code> attribute.
            <pre>from TempStream<br/>select roomNo, temp, 'C' as scale<br>insert into RoomTempStream;</pre>    
        </td>
    </tr>
    <tr>
        <td>Mathematical and logical expressions in attributes</td>
        <td>Defines the mathematical and logical operations that need to be performed to generating output attribute values. These expressions are executed in the precedence order given below.
            <br><br>
            <b>Operator precedence</b><br>
            <table style="width:100%">
                <tr>
                    <th style="width:10%">Operator</th>
                    <th style="width:40%">Distribution</th>
                    <th style="width:50%">Example</th>
                </tr>
                <tr>
                    <td><code>()</code></td>
                    <td>Scope</td>
                    <td><code>(cost + tax) * 0.05</code></td>
                </tr>
                <tr>
                    <td><code>IS NULL</code></td>
                    <td>Null check</td>
                    <td><code>deviceID is null</code></td>
                </tr>
                <tr>
                    <td><code>NOT</code></td>
                    <td>Logical NOT</td>
                    <td><code>not (price > 10)</code></td>
                </tr>
                <tr>
                    <td><code> * </code>,<code>/</code>,<code>%</code></td>
                    <td>Multiplication, division, modulus</td>
                    <td><code>temp * 9/5 + 32</code></td>
                </tr>
                <tr>
                    <td><code>+</code>,<code>-</code></td>
                    <td>Addition, subtraction</td>
                    <td><code>temp * 9/5 - 32</code></td>
                </tr>
                <tr>
                    <td><code><</code>,<code><=</code>,<br/><code>></code>,<code>>=</code></td>
                    <td>Comparators: less-than, greater-than-equal, greater-than, less-than-equal</td>
                    <td><code>totalCost >= price * quantity</code></td>
                </tr>
                <tr>
                    <td><code>==</code>,<code>!=</code></td>
                    <td>Comparisons: equal, not equal</td>
                    <td><code>totalCost !=  price * quantity</code></td>
                </tr>
                <tr>
                    <td><code>IN</code></td>
                    <td>Checks if value exist in the table</td>
                    <td><code>roomNo in ServerRoomsTable</code></td>
                </tr>
                <tr>
                    <td><code>AND</code></td>
                    <td>Logical AND</td>
                    <td><code>temp < 40 and humidity < 40</code></td>
                </tr>
                <tr>
                    <td><code>OR</code></td>
                    <td>Logical OR</td>
                    <td><code>humidity < 40 or humidity >= 60</code></td>
                </tr>
            </table>
            E.g., Query converts temperature from Celsius to Fahrenheit, and identifies rooms with room number between 10 and 15 as server rooms.
            <pre>from TempStream<br>select roomNo, temp * 9/5 + 32 as temp, 'F' as scale,<br>       roomNo > 10 and roomNo < 15 as isServerRoom<br>insert into RoomTempStream;</pre>       
    </tr>

</table>

###Function

Functions are pre-configured operations that can consumes zero, or more parameters and always produce a single value as result. It can be used anywhere an attribute can be used.

**Purpose**

It encapsulate pre-configured reusable execution logic allowing users to execute the logic anywhere just by calling the function. This also make writing SiddhiApps simple and easy to understand.

**Syntax**

The syntax of function is as follows,

```siddhi
(<namespace>:)?<function name>( (<parameter>(, <parameter>)*)? )
```

Here, the `<namespace>` and `<function name>` together uniquely identifies the function. The `<function name>` is used to specify the operation provided by the function, and the `<namespace>` is used to identify the extension where the function exists. The inbuilt functions do not belong to a namespace, and hence `<namespace>` is omitted when they are defined. The `<parameter>`s define the input parameters that the function accepts. The input parameters can be attributes, constant values, results of other functions, results of mathematical or logical expressions, or time values. The number and type of parameters a function accepts depend on the function itself.

!!! note
    Functions, mathematical expressions, and logical expressions can be used in a nested manner.

**Inbuilt functions**

Following are some inbuilt Siddhi functions.

|Inbuilt function | Description|
| ------------- |-------------|
| <a target="_blank" href="../api/latest/#eventtimestamp-function">eventTimestamp</a> | Returns event's timestamp. |
| <a target="_blank" href="../api/latest/#currenttimemillis-function">currentTimeMillis</a> | Returns current time of SiddhiApp runtime. |
| <a target="_blank" href="../api/latest/#default-function">default</a> | Returns a default value if the parameter is null. |
| <a target="_blank" href="../api/latest/#ifthenelse-function">ifThenElse</a> | Returns parameters based on a conditional parameter. |
| <a target="_blank" href="../api/latest/#uuid-function">UUID</a> | Generates a UUID. |
| <a target="_blank" href="../api/latest/#cast-function">cast</a> | Casts parameter type. |
| <a target="_blank" href="../api/latest/#convert-function">convert</a> | Converts parameter type. |
| <a target="_blank" href="../api/latest/#coalesce-function">coalesce</a> | Returns first not null input parameter. |
| <a target="_blank" href="../api/latest/#maximum-function">maximum</a> | Returns the maximum value of all parameters. |
| <a target="_blank" href="../api/latest/#minimum-function">minimum</a> | Returns the minimum value of all parameters. |
| <a target="_blank" href="../api/latest/#instanceofboolean-function">instanceOfBoolean</a> | Checks if the parameter is an instance of Boolean. |
| <a target="_blank" href="../api/latest/#instanceofdouble-function">instanceOfDouble</a> | Checks if the parameter is an instance of Double. |
| <a target="_blank" href="../api/latest/#instanceoffloat-function">instanceOfFloat</a> | Checks if the parameter is an instance of Float. |
| <a target="_blank" href="../api/latest/#instanceofinteger-function">instanceOfInteger</a> | Checks if the parameter is an instance of Integer. |
| <a target="_blank" href="../api/latest/#instanceoflong-function">instanceOfLong</a> | Checks if the parameter is an instance of Long. |
| <a target="_blank" href="../api/latest/#instanceofstring-function">instanceOfString</a> | Checks if the parameter is an instance of String. |
| <a target="_blank" href="../api/latest/#createset-function">createSet</a> | Creates  HashSet with given input parameters. |
| <a target="_blank" href="../api/latest/#minimum-function">sizeOfSet</a> | Returns number of items in the HashSet, that's passed as a parameter. |


**Extension functions**

Several pre written functions can be found in the Siddhi extensions available **<a target="_blank" href="../extensions/">here</a>**.


Several pre written functions can be found under `siddhi-execution-*` extensions available **<a target="_blank" href="../extensions/">here</a>**.

**Example 1**

Function with name `ifThenElse` accepting three input parameters, first parameter being a `bool` condition `price>700` and the second and the third parameters being the output for if case `'high'`, and else case `'low'`.

```
ifThenElse(price>700, 'high', 'low')
```

**Example 2**

math:ceil(inValue)

Function with name `ceil` in `math` namespace accepting a single input parameters `56.89` and produces ceiling value `57` as output.

```
math:ceil(56.89)
```

**Example 3**

Query to convert the `roomNo` to `string` using `convert` function, find the maximum temperature reading with `maximum` function, and to add a unique `messageID` using the `UUID` function.

```siddhi
from TempStream
select convert(roomNo, 'string') as roomNo,
       maximum(tempReading1, tempReading2) as temp,
       UUID() as messageID
insert into RoomTempStream;
```

### Filter

Filters filter events arriving on input streams based on specified conditions. They accept any type of condition including a combination of attributes, constants, functions, and others, that produces a Boolean result. Filters allow events to pass through if the condition results in `true`, and drops if it results in a `false`.  

**Purpose**

Filter helps to select the events that are relevant for processing and omit the ones that are not.

**Syntax**

Filter conditions should be defined in square brackets (`[]`) next to the input stream as shown below.

```siddhi
from <input stream>[<filter condition>]
select <attribute name>, <attribute name>, ...
insert into <output stream>
```

**Example**

Query to filter `TempStream` stream events, having `roomNo` within the range of 100-210 and temperature greater than 40 degrees,
and insert the filtered results into `HighTempStream` stream.

```siddhi
from TempStream[(roomNo >= 100 and roomNo < 210) and temp > 40]
select roomNo, temp
insert into HighTempStream;
```

### Stream Function

Stream functions process the events that arrive via the input stream (or [named-window](#named-window)), to generate zero or more new events with one or more additional output attributes for each event. Unlike the standard functions, they operate directly on the streams or (or [named-windows](#named-window)) and can add the function outputs via predefined attributes on the generated events.

**Purpose**

Stream function is useful when a function produces more than one output for the given input parameters. In this case, the outputs are added to the event, using newly introduced attributes with predefined attribute names.

**Syntax**

Stream function should be defined next to the input stream or [named-windows](#named-window) along the `#` prefix as shown below.

```siddhi
from <input stream>#(<namespace>:)?<stream function name>(<parameter>, <parameter>, ... )
select <attribute name>, <attribute name>, ...
insert into <output stream>
```

Here, the `<namespace>` and `<stream function name>` together uniquely identifies the stream function. The `<stream function name>` is used to specify the operation provided by the window, and the `<namespace>` is used to identify the extension where the stream function exists. The inbuilt stream functions do not belong to a namespace, and hence `<namespace>` is omitted when they are defined. The `<parameter>`s define the input parameters that the stream function accepts. The input parameters can be attributes, constant values, functions, mathematical or logical expressions, or time values. The number and type of parameters a stream function accepts depend on the stream function itself.

**Inbuilt stream functions**

Following is an inbuilt Siddhi stream function.

|Inbuilt stream function | Description|
| ------------- |-------------|
| <a target="_blank" href="../api/latest/#pol2cart-stream-function">pol2Cart</a> | Calculates cartesian coordinates `x` and `y` for the given `theta`, and `rho` coordinates.|

**Extension stream functions**

Several pre written stream functions can be found in the Siddhi extensions available **<a target="_blank" href="../extensions/">here</a>**.

**Example**

A query to calculate cartesian coordinates from `theta`, and `rho` attribute values optioned from the `PolarStream` stream, and to insert the results `x` and `y` via `CartesianStream` stream.

```siddhi
define stream PolarStream (theta double, rho double);

from PolarStream#pol2Cart(theta, rho)
select x, y
insert into CartesianStream;
```

Here, the `pol2Cart` stream function amend the events with `x` and `y` attributes with respective cartesian values.

### Window

Windows capture a subset of events from input streams and retain them for a period of time based on a specified criterion. The criterion defines when and how the events should be evicted from the window. Such as events getting evicted based on time duration, or number of events in the window, and the way they get evicted is in sliding (one by one) or tumbling (batch) manner.

In a query, each input stream can at most have only one window associated with it.

**Purpose**

Windows help to retain events based on a criterion, such that the values of those events can be aggregated, correlated or checked, if the event of interest is in the window.

**Syntax**

Window should be defined next to the input stream along the `#window` prefix as shown below.

```siddhi
from <input stream>#window.(<namespace>:)?<window name>(<parameter>, <parameter>, ... )
select <attribute name>, <attribute name>, ...
insert <output event type>? into <output stream>
```

Here, the `<namespace>` and `<window name>` together uniquely identifies the window. The `<window name>` is used to specify the operation provided by the window, and the `<namespace>` is used to identify the extension where the window exists. The inbuilt windows do not belong to a namespace, and hence `<namespace>` is omitted when they are defined. The `<parameter>`s define the input parameters that the window accepts. The input parameters can be attributes, constant values, functions, mathematical or logical expressions, or time values. The number and type of parameters a window accepts depend on the window itself.

!!! note
    Filter conditions and stream functions can be applied both before and/or after the window.

**Inbuilt windows**

Following are some inbuilt Siddhi windows.

|Inbuilt function | Description|
| ------------- |-------------|
| <a target="_blank" href="../api/latest/#time-window">time</a> | Retains events based on time in a sliding manner.|
| <a target="_blank" href="../api/latest/#timebatch-window">timeBatch</a> | Retains events based on time in a tumbling/batch manner. |
| <a target="_blank" href="../api/latest/#length-window">length</a> | Retains events based on number of events in a sliding manner. |
| <a target="_blank" href="../api/latest/#lengthbatch-window">lengthBatch</a> | Retains events based on number of events in a tumbling/batch manner. |
| <a target="_blank" href="../api/latest/#timelength-window">timeLength</a> | Retains events based on time and number of events in a sliding manner. |
| <a target="_blank" href="../api/latest/#session-window">session</a> | Retains events for each session based on session key. |
| <a target="_blank" href="../api/latest/#batch-window">batch</a> | Retains events of last arrived event chunk. |
| <a target="_blank" href="../api/latest/#sort-window">sort</a> | Retains top-k or bottom-k events based on a parameter value. |
| <a target="_blank" href="../api/latest/#cron-window">cron</a> | Retains events based on cron time in a tumbling/batch manner. |
| <a target="_blank" href="../api/latest/#externaltime-window">externalTime</a> | Retains events based on event time value passed as a parameter in a sliding manner.|
| <a target="_blank" href="../api/latest/#externaltimebatch-window">externalTimeBatch</a> | Retains events based on event time value passed as a parameter in a a tumbling/batch manner.|
| <a target="_blank" href="../api/latest/#delay-window">delay</a> | Retains events and delays the output by the given time period in a sliding manner.|

**Extension windows**

Several pre written windows can be found under `siddhi-execution-*` extensions available **<a target="_blank" href="../extensions/">here</a>**.

**Example 1**

Query to find out the maximum temperature out of the **last 10 events**, using the window of `length` 10 and `max()` aggregation function, from the `TempStream` stream and insert the results into the `MaxTempStream` stream.

```siddhi
from TempStream#window.length(10)
select max(temp) as maxTemp
insert into MaxTempStream;
```

Here, the `length` window operates in a sliding manner where the following 3 event subsets are calculated and outputted when a list of 12 events are received in sequential order.

|Subset|Event Range|
|------|-----------|
| 1 | 1 - 10 |
| 2 | 2 - 11 |
| 3 | 3 - 12 |

**Example 2**

Query to find out the maximum temperature out of the **every 10 events**, using the window of `lengthBatch` 10 and `max()` aggregation function, from the `TempStream` stream and insert the results into the `MaxTempStream` stream.

```siddhi
from TempStream#window.lengthBatch(10)
select max(temp) as maxTemp
insert into MaxTempStream;
```

Here, the window operates in a batch/tumbling manner where the following 3 event subsets are calculated and outputted when a list of 30 events are received in a sequential order.

|Subset|Event Range|
|------|-----------|
| 1    | 1 - 10      |
| 2    | 11 - 20     |
| 3    | 21 - 30     |

**Example 3**

Query to find out the maximum temperature out of the events arrived **during last 10 minutes**, using the window of `time` 10 minutes and `max()` aggregation function, from the `TempStream` stream and insert the results into the `MaxTempStream` stream.

```siddhi
from TempStream#window.time(10 min)
select max(temp) as maxTemp
insert into MaxTempStream;
```

Here, the `time` window operates in a sliding manner with millisecond accuracy, where it will process events in the following 3 time durations and output aggregated events when a list of events are received in a sequential order.

|Subset|Time Range (in ms)|
|------|-----------|
| 1 | 1:00:00.001 - 1:10:00.000 |
| 2 | 1:00:01.001 - 1:10:01.000 |
| 3 | 1:00:01.033 - 1:10:01.034 |

**Example 4**

Query to find out the maximum temperature out of the events arriving **every 10 minutes**, using the window of `timeBatch` 10 and `max()` aggregation function, from the `TempStream` stream and insert the results into the `MaxTempStream` stream.

```siddhi
from TempStream#window.timeBatch(10 min)
select max(temp) as maxTemp
insert into MaxTempStream;
```

Here, the window operates in a batch/tumbling manner where the window will process events in the following 3 time durations and output aggregated events when a list of events are received in a sequential order.

|Subset|Time Range (in ms)|
|------|-----------|
| 1 | 1:00:00.001 - 1:10:00.000 |
| 2 | 1:10:00.001 - 1:20:00.000 |
| 3 | 1:20:00.001 - 1:30:00.000 |

**Example 5**

Query to find out the unique number of `deviceID`s arrived over last **1 minute**, using the `time` window in the `unique` extension, and to insert the results into the `UniqueCountStream` stream.

```siddhi
define stream TempStream (deviceID long, roomNo int, temp double);

from TempStream#window.unique:time(deviceID, 1 sec)
select count(deviceID) as deviceIDs
insert into UniqueCountStream ;
```

### Event Type

Query output depends on the `current` and `expired` event types produced by the query based on its internal processing state. By default all queries produce `current` events upon event arrival. The queries containing windows additionally produce `expired` events when events expire from those windows.

**Purpose**

Event type helps to identify how the events were produced and to specify when a query should output such events to the output stream, such as output processed events only upon new event arrival to the query, upon event expiry from the window, or upon both cases.

**Syntax**

Event type should be defined in between `insert` and `into` keywords for insert queries as follows.

```siddhi
from <input stream>#window.<window name>(<parameter>, <parameter>, ... )
select <attribute name>, <attribute name>, ...
insert <event type> into <output stream>
```

Event type should be defined next to the `for` keyword for delete queries as follows.

```siddhi
from <input stream>#window.<window name>(<parameter>, <parameter>, ... )
select <attribute name>, <attribute name>, ...
delete <table> (for <event type>)?
    on <condition>
```

Event type should be defined next to the `for` keyword for update queries as follows.

```siddhi
from <input stream>#window.<window name>(<parameter>, <parameter>, ... )
select <attribute name>, <attribute name>, ...
update <table> (for <event type>)?
    set <table>.<attribute name> = (<attribute name>|<expression>)?, <table>.<attribute name> = (<attribute name>|<expression>)?, ...
    on <condition>
```

Event type should be defined next to the `for` keyword for update or insert queries as follows.

```siddhi
from <input stream>#window.<window name>(<parameter>, <parameter>, ... )
select <attribute name>, <attribute name>, ...
update or insert into <table> (for <event type>)?
    set <table>.<attribute name> = <expression>, <table>.<attribute name> = <expression>, ...
    on <condition>
```

The event types can be defined using the following keywords to manipulate query output.

| Event types | Description |
|-------------------|-------------|
| `current events` | Outputs processed events only upon new event arrival at the query. </br> This is default behavior when no specific event type is specified.|
| `expired events` | Outputs processed events only upon event expiry from the window. |
| `all events` | Outputs processed events when both new events arrive at the query as well as when events expire from the window. |

!!! note
    Controlling query output based on the event types neither alters query execution nor its accuracy.  

**Example**

Query to output processed events only upon event expiry from the 1 minute time window to the `DelayedTempStream` stream. This query helps to delay events by a minute.

```siddhi
from TempStream#window.time(1 min)
select *
insert expired events into DelayedTempStream
```

!!! Note
    This is just to illustrate how expired events work, it is recommended to use [delay](../api/latest/#delay-window) window for use cases where we need to delay events by a given time period of time.

### Aggregate Function

Aggregate functions are pre-configured aggregation operations that can consume zero, or more parameters from multiple events and produce a single value as result. They can be only used in query projection (as part of the `select` clause). When a query comprises a window, the aggregation will be constrained to the events in the window, and when it does not have a window, the aggregation is performed from the first event the query has received.

**Purpose**

Aggregate functions encapsulate pre-configured reusable aggregate logic allowing users to aggregate values of multiple events together. When used with batch/tumbling windows this will also reduce the number of output events produced.  

**Syntax**

Aggregate function can be used in query projection (as part of the `select` clause) alone or as a part of another expression. In all cases, the output produced should be properly mapped to the output stream attribute of the query using the `as` keyword.

The syntax of aggregate function is as follows,

```siddhi
from <input stream>#window.<window name>(<parameter>, <parameter>, ... )
select (<namespace>:)?<aggregate function name>(<parameter>, <parameter>, ... ) as <attribute name>, <attribute2 name>, ...
insert into <output stream>;
```

Here, the `<namespace>` and `<aggregate function name>` together uniquely identifies the aggregate function. The `<aggregate function name>` is used to specify the operation provided by the aggregate function, and the `<namespace>` is used to identify the extension where the aggregate function exists. The inbuilt aggregate functions do not belong to a namespace, and hence `<namespace>` is omitted when they are defined. The `<parameter>`s define the input parameters the aggregate function accepts. The input parameters can be attributes, constant values, results of other functions or aggregate functions, results of mathematical or logical expressions, or time values. The number and type of parameters an aggregate function accepts depend on the aggregate function itself.

**Inbuilt aggregate functions**

Following are some inbuilt aggregation functions.

|Inbuilt aggregate function | Description|
| ------------- |-------------|
| <a target="_blank" href="../api/latest/#sum-aggregate-function">sum</a> | Calculates the sum from a set of values. |
| <a target="_blank" href="../api/latest/#count-aggregate-function">count</a> | Calculates the count from a set of values. |
| <a target="_blank" href="../api/latest/#distinctcount-aggregate-function">distinctCount</a> | Calculates the distinct count based on a parameter from a set of values. |
| <a target="_blank" href="../api/latest/#avg-aggregate-function">avg</a> | Calculates the average from a set of values.|
| <a target="_blank" href="../api/latest/#max-aggregate-function">max</a> | Finds the maximum value from a set of values. |
| <a target="_blank" href="../api/latest/#min-aggregate-function">min</a> | Finds the minimum value from a set of values. |
| <a target="_blank" href="../api/latest/#maxforever-aggregate-function">maxForever</a> | Finds the maximum value from all events throughout its lifetime irrespective of the windows. |
| <a target="_blank" href="../api/latest/#minforever-aggregate-function">minForever</a> | Finds the minimum value from all events throughout its lifetime irrespective of the windows. |
| <a target="_blank" href="../api/latest/#stddev-aggregate-function">stdDev</a> | Calculates the standard deviation from a set of values. |
| <a target="_blank" href="../api/latest/#and-aggregate-function">and</a> | Calculates boolean `and` from a set of values. |
| <a target="_blank" href="../api/latest/#or-aggregate-function">or</a> | Calculates boolean `or` from a set of values. |
| <a target="_blank" href="../api/latest/#unionset-aggregate-function">unionSet</a> | Constructs a Set by unioning set of values. |

**Extension aggregate functions**

Several pre written aggregate functions can be found under `siddhi-execution-*` extensions available **<a target="_blank" href="../extensions/">here</a>**.

**Example**

Query to calculate average, maximum, minimum and 97th percentile values on `temp` attribute of the `TempStream` stream in a sliding manner, from the events arrived over the last 10 minutes and to produce output events with attributes `avgTemp`, `maxTemp`, `minTemp` and `percentile97` respectively to the `AggTempStream` stream.

```siddhi
from TempStream#window.time(10 min)
select avg(temp) as avgTemp, max(temp) as maxTemp, min(temp) as minTemp, math:percentile(temp, 97.0) as percentile97
insert into AggTempStream;
```

### Group By

Group By groups events based on one or more specified attributes to perform aggregate operations.

**Purpose**

Group By helps to perform aggregate functions independently for each given group-by key combination.

**Syntax**

The syntax for the Group By with aggregate function is as follows.

```siddhi
from <input stream>#window.<window name>(...)
select <aggregate function>( <parameter>, <parameter>, ...) as <attribute1 name>, <attribute2 name>, ...
group by <attribute1 name>, <attribute2 name>, ...
insert into <output stream>;
```

Here the group by attributes should be defined next to the `group by` keyword separating each attribute by a comma.

**Example**

Query to calculate the average `temp` per each `roomNo` and `deviceID` combination, from the events arrived from `TempStream` stream, during the last 10 minutes time-window in a sliding manner.

```siddhi
from TempStream#window.time(10 min)
select roomNo, deviceID, avg(temp) as avgTemp
group by roomNo, deviceID
insert into AvgTempStream;
```

### Having

Having filters events at the query output using a specified condition on query output stream attributes. It accepts any type of condition including a combination of output  stream attributes, constants, and/or functions that produces a Boolean result. Having, allow events to passthrough if the condition results in `true`, and drops if it results in a `false`.  

**Purpose**

Having helps to select the events that are relevant for the output based on the attributes those are produced by the `select` clause and omit the ones that are not.

**Syntax**

The syntax for the Having clause is as follows.

```siddhi
from <input stream>#window.<window name>( ... )
select <aggregate function>( <parameter>, <parameter>, ...) as <attribute1 name>, <attribute2 name>, ...
group by <attribute1 name>, <attribute2 name> ...
having <condition>
insert into <output stream>;
```

Here the having `<condition>` should be defined next to the `having` keyword, and it can be used with or without `group by` clause.

**Example**

Query to calculate the average `temp` per `roomNo` for the events arrived on the last 10 minutes, and send alerts for each event having `avgTemp` more than 30 degrees.

```siddhi
from TempStream#window.time(10 min)
select roomNo, avg(temp) as avgTemp
group by roomNo
having avgTemp > 30
insert into AlertStream;
```

### Order By

Order By, orders the query results in ascending or descending order based on one or more specified attributes. By default the order by attribute orders the events in ascending order, and by adding `desc` keyword, the events can be ordered in descending order. When more than one attribute is defined the attributes defined towards the left will have more precedence in ordering than the ones defined in right.  

**Purpose**

Order By helps to sort the events in the query output chunks. Order By will only be effective when query outputs a lot of events together such as in batch windows than for sliding windows where events are emitted one at a time.

**Syntax**

The syntax for the Order By clause is as follows:

```siddhi
from <input stream>#window.<window name>( ... )
select <aggregate function>( <parameter>, <parameter>, ...) as <attribute1 name>, <attribute2 name>, ...
group by <attribute1 name>, <attribute2 name> ...
having <condition>
order by <attribute1 name> (asc|desc)?, <attribute2 name> (asc|desc)?, ...
insert into <output stream>;
```

Here, the order by attributes (`<attributeN name>`) should be defined next to the `order by` keyword separating each by a comma, and optionally the event ordering can be specified using `asc` (default) or `desc` keywords to respectively define ascending and descending.

**Example**

Query to calculate the average `temp`, per `roomNo` and `deviceID` combination, on every 10 minutes batches, and order the generated output events in ascending order by `avgTemp` and then in descending order of `roomNo` (if there are more events having the same `avgTemp` value) before emitting them to the `AvgTempStream` stream.

```siddhi
from TempStream#window.timeBatch(10 min)
select roomNo, deviceID, avg(temp) as avgTemp
group by roomNo, deviceID
order by avgTemp, roomNo desc
insert into AvgTempStream;
```

### Limit & Offset

These provide a way to select a limited number of events (via limit) from the desired index (using an offset) from the output event chunks produced by the query.

**Purpose**

Limit & Offset helps to output only the selected set of events from large event batches. This will be very useful with `Order By` clause where one can order the output and extract the topK or bottomK events, and even use it to paginate through the dataset by obtaining set of events from the middle.   

**Syntax**

The syntax for the Limit & Offset clauses is as follows:

```siddhi
from <input stream>#window.<window name>( ... )
select <aggregate function>( <parameter>, <parameter>, ...) as <attribute1 name>, <attribute2 name>, ...
group by <attribute1 name>, <attribute2 name> ...
having <condition>
order by <attribute1 name> (asc | desc)?, <attribute2 name> (<ascend/descend>)?, ...
limit <positive integer>?
offset <positive integer>?
insert into <output stream>;
```

Here both `limit` and `offset` are optional and both can be defined by adding a positive integer next to their keywords, when `limit` is omitted the query will output all the events, and when `offset` is omitted `0` is taken as the default offset value.

**Example 1**

Query to calculate the average `temp`, per `roomNo` and `deviceID` combination, for every 10 minutes batches, from the events arriving at the `TempStream` stream, and emit only two events having the highest `avgTemp` value.

```siddhi
from TempStream#window.timeBatch(10 min)
select roomNo, deviceID, avg(temp) as avgTemp
group by roomNo, deviceID
order by avgTemp desc
limit 2
insert into HighestAvgTempStream;
```

**Example 2**

Query to calculate the average `temp`, per `roomNo` and `deviceID` combination, for every 10 minutes batches, for the events arriving at the `TempStream` stream, and emits only the third, forth and fifth events when sorted in descending order based on their `avgTemp` value.

```siddhi
from TempStream#window.timeBatch(10 min)
select roomNo, deviceID, avg(temp) as avgTemp
group by roomNo, deviceID
order by avgTemp desc
limit 3
offset 2
insert into HighestAvgTempStream;
```

### Stream Processor

Stream processors are a combination of stream [stream functions](#stream-function) and [windows](#windows). They work directly on the input streams (or [named-windows](#named-window)), to generate zero or more new events with zero or more additional output attributes while having the ability to retain and arbitrarily emit events.

They are more advanced than stream functions as they can retain and arbitrarily emit events, and they are more advanced than windows because they can add additional attributes to the events.

**Purpose**

Stream processors help to achieve complex execution logics that cannot be achieved by other constructs such as [functions](#function), [aggregate functions](#aggregate-function), [stream functions](#stream-function) and  [windows](#windows).

**Syntax**

Stream processor should be defined next to the input stream or [named-windows](#named-window) along the `#` prefix as shown below.

```siddhi
from <input stream>#(<namespace>:)?<stream processor name>(<parameter>, <parameter>, ... )
select <attribute name>, <attribute name>, ...
insert into <output stream>
```

Here, the `<namespace>` and `<stream processor name>` together uniquely identifies the stream processor. The `<stream processor name>` is used to specify the operation provided by the window, and the `<namespace>` is used to identify the extension where the stream processor exists. The inbuilt stream processors do not belong to a namespace, and hence `<namespace>` is omitted when they are defined. The `<parameter>`s define the input parameters that the stream processor accepts. The input parameters can be attributes, constant values, processors, mathematical or logical expressions, or time values. The number and type of parameters a stream processor accepts depend on the stream processor itself.

**Inbuilt stream processors**

Following is an inbuilt Siddhi stream processor.

|Inbuilt stream processor | Description|
| ------------- |-------------|
| <a target="_blank" href="../api/latest/#log-stream-processor">log</a> | Logs the message on the given priority with or without the processed event.|

**Extension stream processors**

Several pre written stream processors can be found in the Siddhi extensions available **<a target="_blank" href="../extensions/">here</a>**.

!!! note
    Stream processors can be used before or after [filters](#filter), [stream functions](#stream-function), [windows](#windows), or other stream processors.

**Example**

A query to log a message `"Sample Event :"` along with the event on `"INFO"` log level for all events of `InputStream` Stream.

```siddhi
from InputStream#log("INFO", "Sample Event :", true)
select *
insert into IgnoreStream;
```

### Join (Stream)

Joins combine events from two streams in real-time based on a specified condition.

**Purpose**

Join provides a way of correlating events of two steams and in addition aggregating them based on the defined windows.

Two streams cannot directly join as they are stateless, and they do not retain events. Therefore, each stream needs to be associated with a window for joining as it can retain events. Join also accepts a condition to match events against each event stream window.

During the joining process each incoming event of each stream is matched against all the events in the other stream's window based on the given condition, and the output events are generated for all the matching event pairs.

When there is no window associated with the joining steam, and empty window with length zero is assigned to the steam by default, to enable join process while preserving stream's stateless nature.

!!! Note
    Join can also be performed with [table](#join-table), [named-aggregation](#join-named-aggregation), or [named-windows](#join-named-window).

**Syntax**

The syntax to join two streams is as follows:

```siddhi
from <input stream>(<non window handler>)*(#window.<window name>(<parameter>, ... ))? (as <reference>)? (unidirectional)?
         <join type> <input stream>(<non window handler>)*(#window.<window name>(<parameter>,  ... ))? (as <reference>)? (unidirectional)? 
    (on <join condition>)?
select <reference>.<attribute name>, <reference>.<attribute name>, ...
insert into <output stream>
```

Here, both the streams can have optional non window handlers (filters, stream functions, and stream processors) followed by a window associated with them. They can also have an optional `<join condition>` next to the `on` keyword to match events from both windows to generate combined output events.

!!! Note "Window should be defined as the last element of each joining stream."
    Join query expects a window to be defined as the last element of each joining stream, therefore a filter cannot be defined after the window.

**Supported join types**

Following are the supported join operations.

 *  **Inner join (join)**

    This is the default behavior of a join operation, and the `join` keyword is used to join both the streams.

    The output is generated only if there is a matching event in both the stream windows when either of the streams triggers the join operation.

 *  **Left outer join**

    The `left outer join` keyword is used to join two streams while producing all left stream events to the output.

    Here, the output is generated when right stream triggers the join operation and finds matching events in the left stream window to perform the join, and in all cases where the left stream triggers the join operation. Here, when the left stream finds matching events in the right stream window, it uses them for the join, and if there are no matching events, then it uses null values for the join operation.

 *  **Right outer join**

    This is similar to a `left outer join` and the `right outer join` keyword is used to join two streams while producing all right stream events to the output.

    It generate output in all cases where the right stream triggers the join operation even if there are no matching events in the left stream window.

 *  **Full outer join**

    The full outer join combines the results of left outer join and right outer join. The `full outer join` keyword is used to join the streams while producing both left and stream events to the output.

    Here, the output is generated in all cases where the left or right stream triggers the join operation, and when a stream finds matching events in the other stream window, it uses them for the join, and if there are no matching events, then it uses null values instead.

!!! Note "Cross join"
    In either of these cases, when the join condition is omitted, the triggering event will successfully match against all the events in the other stream window, producing a cross join behavior.

**Unidirectional join operation**

By default, events arriving on either stream trigger the join operation and generate the corresponding output. However, this join behavior can be controlled by adding the `unidirectional` keyword next to one of the streams as depicted in the join query syntax above. This enables only the stream with the `unidirectional` to trigger the join operation. Therefore the events arriving on the other stream will neither trigger the join operation nor produce any output, but rather they only update their stream's window state.

!!! Note "The `unidirectional` keyword cannot be applied on both join streams."
    This is because the default behavior already allows both the streams to trigger the join operation.

**Example 1 (join)**

A query to generate output when there is a matching event having equal `symbol` and `companyID` combination from the events arrived in the last 10 minutes on `StockStream` stream and the events arrived in the last 20 minutes on `TwitterStream` stream.

```siddhi
define stream StockStream (symbol string, price float, volume long);
define stream TwitterStream (companyID string, tweet string);

from StockStream#window.time(10 min) as S
    join TwitterStream#window.time(20 min) as T
    on S.symbol== T.companyID
select S.symbol as symbol, T.tweet, S.price
insert into OutputStream ;
```

Possible OutputStream outputs as follows
```
("FB", "FB is great!", 23.5f)
("GOOG", "Its time to Google!", 54.5f)
```

**Example 2 (with no join condition)**

A query to generate output for all possible event combinations from the last 5 events of the `StockStream` stream and the events arrived in the last 1 minutes on `TwitterStream` stream.

```siddhi
define stream StockStream (symbol string, price float, volume long);
define stream TwitterStream (companyID string, tweet string);

from StockStream#window.length(5) as S
    join TwitterStream#window.time(1 min) as T
select S.symbol as symbol, T.tweet, S.price
insert into OutputStream ;
```

Possible OutputStream outputs as follows,
```
("FB", "FB is great!", 23.5f)
("FB", "Its time to Google!", 23.5f)
("GOOG", "FB is great!", 54.5f)
("GOOG", "Its time to Google!", 54.5f)
```

**Example 3 (left outer join)**

A query to generate output for all events arriving in the `StockStream` stream regardless of whether there is a matching `companyID` for `symbol` exist in the events arrived in the last 20 minutes on `TwitterStream` stream, and generate output for the events arriving in the `StockStream` stream only when there is a matchine `symbol` and `companyID` combination exist in the events arrived in the last 10 minutes on `StockStream` stream.

```siddhi
define stream StockStream (symbol string, price float, volume long);
define stream TwitterStream (companyID string, tweet string);

from StockStream#window.time(10 min) as S
    left outer join TwitterStream#window.time(20 min) as T
    on S.symbol== T.companyID
select S.symbol as symbol, T.tweet, S.price
insert into OutputStream ;
```

Possible OutputStream outputs as follows,
```
("FB", "FB is great!", 23.5f)
("GOOG", null, 54.5f) //when there are no matching event in TwitterStream
```

**Example 3 (full outer join)**

A query to generate output for all events arriving in the `StockStream` stream and in the `TwitterStream` stream regardless of whether there is a matching `companyID` for `symbol` exist in the other stream window or not.

```siddhi
define stream StockStream (symbol string, price float, volume long);
define stream TwitterStream (companyID string, tweet string);

from StockStream#window.time(10 min) as S
    full outer join TwitterStream#window.time(20 min) as T
    on S.symbol== T.companyID
select S.symbol as symbol, T.tweet, S.price
insert into OutputStream ;
```

Possible OutputStream outputs as follows,
```
("FB", "FB is great!", 23.5f)
("GOOG", null, 54.5f) //when there are no matching event in TwitterStream
(null, "I like to tweet!", null) //when there are no matching event in StockStream
```

**Example 3 (unidirectional join)**

A query to generate output only when events arrive on `StockStream` stream find a matching event having equal `symbol` and `companyID` combination against the events arrived in the last 20 minutes on `TwitterStream` stream.

```siddhi
define stream StockStream (symbol string, price float, volume long);
define stream TwitterStream (companyID string, tweet string);

from StockStream#window.time(10 min) as S unidirectional
    join TwitterStream#window.time(20 min) as T
    on S.symbol== T.companyID
select S.symbol as symbol, T.tweet, S.price
insert into OutputStream ;
```

Possible OutputStream outputs as follows,
```
("FB", "FB is great!", 23.5f)
("GOOG", "Its time to Google!", 54.5f)
```
Here both outputs will be initiated by events arriving on `StockStream`.

### Pattern

The pattern is a state machine implementation that detects event occurrences from events arrived via one or more event streams over time. It can repetitively match patterns, count event occurrences, and use logical event ordering (using `and`, `or`, and `not`).

**Purpose**

The pattern helps to achieve Complex Event Processing (CEP) capabilities by detecting various pre-defined event occurrence patterns in realtime.

Pattern query does not expect the matching events to occur immediately after each other, and it can successfully correlate the events who are far apart and having other events in between.

**Syntax**

The syntax for a pattern query is as follows,

```siddhi
from (
      (every)? (<event reference>=)?<input stream>[<filter condition>](<<min count>:<max count>>)? |
      (every)? (<event reference>=)?<input stream>[<filter condition>] (and|or) (<event reference>=)?<input stream>[<filter condition>] |
      (every)? not input stream>[<filter condition>] (and <event reference>=<input stream>[<filter condition>] | for <time gap>)
    ) -> ...
    (within <time gap>)?     
select <event reference>.<attribute name>, <event reference>.<attribute name>, ...
insert into <output stream>
```

<table style="width:100%">
    <tr>
        <th style="width:20%">Items</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><code>-></code></td>
        <td>Indicates an event will follow the given event. The subsequent event does not necessarily have to occur immediately after the preceding event. The condition to be met by the preceding event should be added before the <code>-></code>, and the condition to be met by the subsequent event should be added after the <code>-></code>.</td>
    </tr>
    <tr>
        <td><code>every</code></td>
        <td>An optional keyword defining when a new event matching state-machine should be initiated to repetitively match the pattern.<br/>
        When this keyword is not used, the event matching state-machine will be initiated only once.</td>
    </tr>
    <tr>
        <td><code>within &lt;time gap&gt;</code></td>
        <td>An optional <code>within</code> clause that defines the time duration within which all the matching events should occur.</td>
    </tr>
    <tr>
        <td><code>&lt;&lt;min count&gt;:&lt;max count&gt;&gt;</code></td>
        <td>Determines the number of minimum and maximum number of events that should the matched at the given condition. <br/>
        Possible values for the min and max count and their behavior is as follows,
        <table style="width:100%">
            <tr>
                <th>Syntex</th>
                <th>Description</th>
                <th>Example</th>
            </tr>
            <tr>
                <td><code>&lt;n1:n2&gt;</code></td>
                <td>Matches <code>n1</code> to <code>n2</code> events (including <code>n1</code> and not more than <code>n2</code>).</td>
                <td><code>&lt;1:4&gt;</code> matches 1 to 4 events.</td>
            </tr>
            <tr>
                <td><code>&lt;n:&gt;</code></td>
                <td>Matches <code>n</code> or more events (including <code>n</code>).</td>
                <td><code>&lt;2:></code> matches 2 or more events.</td>
            </tr>
            <tr>
                <td><code>&lt;:n&gt;</code></td>
                <td>Matches up to <code>n</code> events (excluding <code>n</code>).</td>
                <td><code>&lt;:5&gt;</code> matches up to 5 events.</td>
            </tr>
            <tr>
                <td><code>&lt;n&gt;</code></td>
                <td>Matches exactly <code>n</code> events.</td>
                <td><code>&lt;5&gt;</code> matches exactly 5 events.</td>
            </tr>
        </table>
        </td>
    </tr>
    <tr>
        <td><code>and</code></td>
        <td>Allows both of its condition to be matched by two distinct events in any order.</td>
    </tr>
    <tr>
        <td><code>or</code></td>
        <td>Only expects one of its condition to be matched by an event. Here the event reference of the unmatched condition will be <code>null</code>.</td>
    </tr>
    <tr>
        <td><code>not &lt;condition1&gt; and &lt;condition2&gt;</code></td>
        <td>Detects the event matching <code>&lt;condition2&gt;</code> before any event matching <code>&lt;condition1&gt;</code>.</td>
    </tr>
    <tr>
        <td><code>not &lt;condition1> for &lt;time period></code></td>
        <td>Detects no event matching on <code>&lt;condition1&gt;</code> for the specified <code>&lt;time period&gt;</code>.</td>
    </tr>
    <tr>
        <td><code>&lt;event reference&gt;</code></td>
        <td>An optional reference to access the matching event for further processing.<br/>
        All conditions can be assigned to an event reference to collect the matching event occurrences, other than the condition used for <code>not</code> case (as there will not be any event matched against it).
        </td>
    </tr>
</table>  

!!! Note "Non occurrence of events."
    Siddhi detects non-occurrence of events using the `not` keyword, and its effective non-occurrence checking period is bounded either by fulfillment of a condition associated by `and` or via an expiry time using `<time period>`.

!!! Note "Logical correlation of multiple conditions."
    Siddhi can only logically correlate two conditions at a time using keywords such as `and`, `or`, and `not`. When more than two conditions need to be logically correlated, use multiple pattern queries in a chaining manner, at a time correlating two logical conditions and streaming the output to a downstream query to logically correlate the results with other logical conditions.

**Event selection**

The `event reference` in pattern queries is used to retrieve the matched events. When a pattern condition is intended to match only a single event, then its attributes can be retrieved by referring to its reference as `<event reference>.<attribute name>`. An example of this is as follows.

+ `e1.symbol`, refers to the `symbol` attribute value of the matching event `e1`.

But when the pattern condition is associated with `<<min count>:<max count>>`, it is expected to match against on multiple events. Therefore, an event from the matched event collection should be retrieved using the event index from its reference. Here the indexes are specified in square brackets next to event reference, where index `0` referring to the first event, and a special index `last` referring to the last available event in the collection.
Attribute values of all the events in the matching event collection can be accessed a list, by referring to their `<event reference>` without an index.
Some possible indexes and their behavior is as follows.

+ `e1[0].symbol`, refers to the `symbol` attribute value of the 1st event in reference `e1`.
+ `e1[3].price`, refers to the `price` attribute value of the 4th event in reference `e1`.
+ `e1[last].symbol`, refers to the `symbol` attribute value of the last event in reference `e1`.
+ `e1[last - 1].symbol`, refers to the `symbol` attribute value of one before the last event in reference `e1`.
+ `e1.symbol`, refers to the list of `symbol` attribute values of all events in the event collection in reference `e1`, as a list object.

The system returns `null` when accessing attribute values, when no matching event is assigned to the `event reference` (as in when two conditions are combined using `or`) or when the provided index is greater than the last event index in the event collection.

**Example 1 (Every)**

A query to send an alerts when temperature of a room increases by 5 degrees within 10 min.

```siddhi
from every( e1=TempStream ) -> e2=TempStream[ e1.roomNo == roomNo and (e1.temp + 5) <= temp ]
    within 10 min
select e1.roomNo, e1.temp as initialTemp, e2.temp as finalTemp
insert into AlertStream;
```

Here, the matching process begins for each event in the `TempStream` stream (as `every` is used with `e1=TempStream`), and if another event arrives within 10 minutes with a value for `temp` attribute being greater than or equal to `e1.temp + 5` of the initial event `e1`, an output is generated via the `AlertStream`.

**Example 2 (Event collection)**

A query to find the temperature difference between two regulator events.

```siddhi
define stream TempStream (deviceID long, roomNo int, temp double);
define stream RegulatorStream (deviceID long, roomNo int, tempSet double, isOn bool);

from every e1=RegulatorStream -> e2=TempStream[e1.roomNo==roomNo]<1:>
      -> e3=RegulatorStream[e1.roomNo==roomNo]
select e1.roomNo, e2[0].temp - e2[last].temp as tempDiff
insert into TempDiffStream;
```

Here, one or more `TempStream` events having the same `roomNo` as of the `RegulatorStream` stream event matched in `e1` is collected, and among them, the first and the last was retrieved to find the temperature difference.

**Example 3 (Logical or condition)**

Query to send the `stop` control action to the regulator via `RegulatorActionStream` when the key is removed from the hotel room. Here the key actions are monitored via `RoomKeyStream` stream, and the regulator state is monitored through `RegulatorStateChangeStream` stream.

```siddhi
define stream RegulatorStateChangeStream(deviceID long, roomNo int, tempSet double, action string);
define stream RoomKeyStream(deviceID long, roomNo int, action string);

from every e1=RegulatorStateChangeStream[ action == 'on' ]
     -> e2=RoomKeyStream[ e1.roomNo == roomNo and action == 'removed' ]
        or e3=RegulatorStateChangeStream[ e1.roomNo == roomNo and action == 'off']
select e1.roomNo, ifThenElse( e2 is null, 'none', 'stop' ) as action
having action != 'none'
insert into RegulatorActionStream;
```

Here, the query sends a `stop` action on `RegulatorActionStream` stream, if a `removed` action is triggered in the `RoomKeyStream` stream before the regulator state changing to `off` which is notified via `RegulatorStateChangeStream` stream.

**Example 4 (Logical not condition)**

Query to generate alerts if the regulator gets switched off before the temperature reaches 12 degrees.  

```siddhi
define stream RegulatorStateChangeStream(deviceID long, roomNo int, tempSet double, action string);
define stream TempStream (deviceID long, roomNo int, temp double);

from every e1=RegulatorStateChangeStream[action == 'start']
     -> not TempStream[e1.roomNo == roomNo and temp <= 12]
        and e2=RegulatorStateChangeStream[e1.roomNo == roomNo and action == 'off']
select e1.roomNo as roomNo
insert into AlertStream;
```
Here, the query alerts the `roomNo` via `AlertStream` stream, when no temperature events having less than 12 arrived in the `TempStream` between the `start` and `off`  actions of the regulator, notified via `RegulatorActionStream` stream.

**Example 5 (Logical not condition)**

Query to alert if the room temperature does not reduce to the set value within 5 minutes after switching on the regulator.  

```siddhi
define stream RegulatorStateChangeStream(deviceID long, roomNo int, tempSet double, action string);
define stream TempStream (deviceID long, roomNo int, temp double);

from e1=RegulatorStateChangeStream[action == 'start']
     -> not TempStream[e1.roomNo == roomNo and temp <= e1.tempSet] for 5 min
select e1.roomNo as roomNo
insert into AlertStream;
```

Here, the query alerts the `roomNo` via `AlertStream` stream, when no temperature events having less than `tempSet` temperature arrived in the `TempStream` within 5 minutes of the regulator `start` action arrived via `RegulatorActionStream` stream.

**Example 6 (Detecting event non-occurrence)**

Following table presents some non-occurrence event matching scenarios that can be implemented using patterns.

Pattern| Description | Sample Scenario
---------|---------|---------
`not A for <time period>`|The non-occurrence of event A within `<time period>` after system start up.| Alerts if the taxi has not reached its destination within 30 minutes, indicating that the passenger might be in danger.
`not A for <time period> and B`|Event A does not occur within `<time period>`, but event B occurs at some point in time. | Alerts if the taxi has not reached its destination within 30 minutes, and the passenger has marked that he/she is in danger at some point in time.
`not A for <time period> or B` |Either event A does not occur within `<time period>`, or event B occurs at some point in time.| Alerts if the taxi has not reached its destination within 30 minutes, or if the passenger has marked that he/she is in danger at some point in time.
`not A for <time period 1> and not B for <time period 2>`|Event A does not occur within `<time period 1>`, and event B also does not occur within `<time period 2>`. | Alerts if the taxi has not reached its destination within 30 minutes, and the passenger has not marked himself/herself not in danger within the same time period.
`not A for <time period 1> or not B for <time period 2>`|Either event A does not occur within `<time period 1>`, or event B occurs within `<time period 2>`. | Alerts if the taxi has not reached its destination A within 20 minutes, or reached its destination B within 30 minutes.
`A → not B for <time period>`|Event B does not occur within `<time period>` after the occurrence of event A. | Alerts if the taxi has reached its destination, but it has been not followed by a payment record within 10 minutes.
`not A and B` or <br/>`A and not B` |Event A does not occur before event B. | Alerts if the taxi is stated before activating the taxi fare calculator.

### Sequence

The sequence is a state machine implementation that detects consecutive event occurrences from events arrived via one or more event streams over time. Here **all matching events need to arrive consecutively**, and there should not be any non-matching events in between the matching sequence of events. The sequence can repetitively match event sequences, count event occurrences, and use logical event ordering (using `and`, `or`, and `not`).

**Purpose**

The sequence helps to achieve Complex Event Processing (CEP) capabilities by detecting various pre-defined consecutive event occurrence sequences in realtime.

Sequence query does expect the matching events to occur immediately after each other, and it can successfully correlate the events who do not have other events in between.

**Syntax**

The syntax for a sequence query is as follows:

```siddhi
from (
      (every)? (<event reference>=)?<input stream>[<filter condition>] (+|*|?)? |
               (<event reference>=)?<input stream>[<filter condition>] (and|or) (<event reference>=)?<input stream>[<filter condition>] |
               not input stream>[<filter condition>] (and <event reference>=<input stream>[<filter condition>] | for <time gap>)
    ), ...
    (within <time gap>)?     
select <event reference>.<attribute name>, <event reference>.<attribute name>, ...
insert into <output stream>
```

<table style="width:100%">
    <tr>
        <th style="width:20%">Items</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><code>,</code></td>
        <td>Indicates the immediate next event that follows the given event. The condition to be met by the preceding event should be added before the <code>,</code>, and the condition to be met by the subsequent event should be added after the <code>,</code>.</td>
    </tr>
    <tr>
        <td><code>every</code></td>
        <td>An optional keyword defining when a new event matching state-machine should be initiated to repetitively match the sequence.<br/>
        When this keyword is not used, the event matching state-machine will be initiated only once.</td>
    </tr>
    <tr>
        <td><code>within &lt;time gap&gt;</code></td>
        <td>An optional <code>within</code> clause that defines the time duration within which all the matching events should occur.</td>
    </tr>
    <tr>
        <td><code> + </code></td>
        <td>Matches **one or more** events to the given condition.</td>
    </tr>
    <tr>
        <td><code> * </code></td>
        <td>Matches **zero or more** events to the given condition.</td>
    </tr>
    <tr>
        <td><code> ? </code></td>
        <td>Matches **zero or one** events to the given condition.</td>
    </tr>
    <tr>
        <td><code>and</code></td>
        <td>Allows both of its condition to be matched by two distinct events in any order.</td>
    </tr>
    <tr>
        <td><code>or</code></td>
        <td>Only expects one of its condition to be matched by an event. Here the event reference of the unmatched condition will be <code>null</code>.</td>
    </tr>
    <tr>
        <td><code>not &lt;condition1&gt; and &lt;condition2&gt;</code></td>
        <td>Detects the event matching <code>&lt;condition2&gt;</code> before any event matching <code>&lt;condition1&gt;</code>.</td>
    </tr>
    <tr>
        <td><code>not &lt;condition1> for &lt;time period></code></td>
        <td>Detects no event matching on <code>&lt;condition1&gt;</code> for the specified <code>&lt;time period&gt;</code>.</td>
    </tr>
    <tr>
        <td><code>&lt;event reference&gt;</code></td>
        <td>An optional reference to access the matching event for further processing.<br/>
        All conditions can be assigned to an event reference to collect the matching event occurrences, other than the condition used for <code>not</code> case (as there will not be any event matched against it).
        </td>
    </tr>
</table>

!!! Note "Non occurrence of events."
    Siddhi detects non-occurrence of events using the `not` keyword, and its effective non-occurrence checking period is bounded either by fulfillment of a condition associated by `and` or via an expiry time using `<time period>`.

!!! Note "Logical correlation of multiple conditions."
    Siddhi can only logically correlate two conditions at a time using keywords such as `and`, `or`, and `not`. When more than two conditions need to be logically correlated, use multiple pattern queries in a chaining manner, at a time correlating two logical conditions and streaming the output to a downstream query to logically correlate the results with other logical conditions.

**Event selection**

The `event reference` in sequence queries is used to retrieve the matched events. When a sequence condition is intended to match only a single event, then its attributes can be retrieved by referring to its reference as `<event reference>.<attribute name>`. An example of this is as follows.

+ `e1.symbol`, refers to the `symbol` attribute value of the matching event `e1`.

But when the pattern condition is associated with `<<min count>:<max count>>`, it is expected to match against on multiple events. Therefore, an event from the matched event collection should be retrieved using the event index from its reference. Here the indexes are specified in square brackets next to event reference, where index `0` referring to the first event, and a special index `last` referring to the last available event in the collection.
Attribute values of all the events in the matching event collection can be accessed a list, by referring to their `<event reference>` without an index.
Some possible indexes and their behavior is as follows.

+ `e1[0].symbol`, refers to the `symbol` attribute value of the 1st event in reference `e1`.
+ `e1[3].price`, refers to the `price` attribute value of the 4th event in reference `e1`.
+ `e1[last].symbol`, refers to the `symbol` attribute value of the last event in reference `e1`.
+ `e1[last - 1].symbol`, refers to the `symbol` attribute value of one before the last event in reference `e1`.
+ `e1.symbol`, refers to the list of `symbol` attribute values of all events in the event collection in reference `e1`, as a list object.

The system returns `null` when accessing attribute values, when no matching event is assigned to the `event reference` (as in when two conditions are combined using `or`) or when the provided index is greater than the last event index in the event collection.

**Example 1 (Every)**

Query to send alerts when temperature increases at least by one degree between two consecutive temperature events.

```siddhi
from every e1=TempStream, e2=TempStream[temp > e1.temp + 1]
select e1.temp as initialTemp, e2.temp as finalTemp
insert into AlertStream;
```

Here, the matching process begins for each event in the `TempStream` stream (as `every` is used with `e1=TempStream`), and if the immediate next event with a value for `temp` attribute being greater than `e1.temp + 1` of the initial event `e1`, then an output is generated via the `AlertStream`.

**Example 2 (Every collection)**

Query to identify temperature peeks by monitoring continuous increases in `temp` attribute and alerts upon the first drop.

```siddhi
define stream TempStream(deviceID long, roomNo int, temp double);

@info(name = 'query1')
from every e1=TempStream,
     e2=TempStream[ifThenElse(e2[last].temp is null, e1.temp <= temp, e2[last].temp <= temp)]+,
     e3=TempStream[e2[last].temp > temp]
select e1.temp as initialTemp, e2[last].temp as peekTemp, e3.temp as firstDropTemp
insert into PeekTempStream ;
```

Here, the matching process begins for each event in the `TempStream` stream (as `every` is used with `e1=TempStream`). It checks if the `temp` attribute value of the second event is greater than or equal to the `temp` attribute value of the first event (`e1.temp`), then for all the following events, their `temp` attribute value is checked if they are greater than or equal to their previous event's `temp` attribute value (`e2[last].temp`), and when the `temp` attribute value becomes less than its previous events `temp` attribute value value an output is generated via the `AlertStream` stream.

**Example 3 (Logical and condition)**

A query to identify a regulator activation event immediately followed by both temperature sensor and humidity sensor activation events in either order.

```siddhi
define stream TempStream(deviceID long, isActive bool);
define stream HumidStream(deviceID long, isActive bool);
define stream RegulatorStream(deviceID long, isOn bool);

from every e1=RegulatorStream[isOn == true], e2=TempStream and e3=HumidStream
select e2.isActive as tempSensorActive, e3.isActive as humidSensorActive
insert into StateNotificationStream;
```
Here, the matching process begins for each event in the `RegulatorStream` stream having the `isOn` attribute `true`. It generates an output via the `StateNotificationStream` stream when an event from both `TempStream` stream and `HumidStream` stream arrives immediately after the first event in either order.

### Output Rate Limiting

Output rate-limiting limits the number of events emitted by the queries based on a specified criterion such as time, and number of events.

**Purpose**

Output rate-limiting helps to reduce the load on the subsequent executions such as query processing, I/O operations, and notifications by reducing the output frequency of the events.

**Syntax**

The syntax for output rate limiting is as follows:

```siddhi
from <input stream> ...
select <attribute name>, <attribute name>, ...
output <rate limiting configuration>
insert into <output stream>
```

Here, the output rate limiting configuration (`<rate limiting configuration>`) should be defined next to the `output` keyword and the supported output rate limiting types are explained in the following table:

Rate limiting configuration|Syntax| Description
---------|---------|--------
Time based | `(<output event selection>)? every <time interval>` | Outputs `<output event selection>` every `<time interval>` time interval.
Number of events based | `(<output event selection>)? every <event interval> events` | Outputs `<output event selection>` for every `<event interval>` number of events.
Snapshot based | `snapshot every <time interval>`| Outputs all events currently in the query window (or outputs only the last event if no window is defined in the query) for every given `<time interval>` time interval.

The `<output event selection>` specifies the event(s) that are selected to be outputted from the query, here when no `<output event selection>` is defined, `all` is used by default.

The possible values for the `<output event selection>` and their behaviors are as follows:

* `first`: The first query output is published as soon as it is generated and the subsequent events are dropped until the specified time interval or the number of events are reached before sending the next event as output.
* `last`: Emits only the last output event generated during the specified time or event interval.
* `all`: Emits all the output events together which are generated during the specified time or event interval.

**Example 1 (Time based first event)**

Query to calculate the average `temp` per `roomNo` for the events arrived on the last 10 minutes, and send alerts **once every 15 minutes** of the events having `avgTemp` more than 30 degrees.

```siddhi
define stream TempStream(deviceID long, roomNo int, temp double);

from TempStream#window.time(10 min)
select roomNo, avg(temp) as avgTemp
group by roomNo
having avgTemp > 30
output first every 15 min
insert into AlertStream;
```

Here the first event having `avgTemp` > 30 is emitted immediately and the next event is only emitted after 15 minutes.

**Example 2 (Event based first event)**

A query to output the initial event, and from there onwards every 5th event of `TempStream` stream.

```siddhi
define stream TempStream(deviceID long, roomNo int, temp double);

from TempStream
output first every 5 events
insert into FiveEventBatchStream;
```

**Example 3 (Event based all events)**

Query to collect last 5 `TempStream` stream events and send them together as a single batch.

```siddhi
define stream TempStream(deviceID long, roomNo int, temp double);

from TempStream
output every 5 events
insert into FiveEventBatchStream;
```

As no `<output event selection>` is defined, the behavior of `all` is applied in this case.

**Example 4 (Time based last event)**

Query to emit only the last event of `TempStream` stream for every 10 minute interval.

```siddhi
define stream TempStream(deviceID long, roomNo int, temp double);

from TempStream
output last every 10 min
insert into FiveEventBatchStream;
```

**Example 5 (Snapshot based)**

Query to emit the snapshot of events retained by its last 5 minutes window defined on `TempStream` stream, every second.

```siddhi
define stream TempStream(deviceID long, roomNo int, temp double);

from TempStream#window.time(5 sec)
output snapshot every 1 sec
insert into SnapshotTempStream;
```

Here, the query emits all the current events generated which do not have a corresponding expired event at the predefined time interval.

**Example 6 (Snapshot based)**

Query to emit the snapshot of events retained every second, when no window is defined on `TempStream` stream.

```siddhi
define stream TempStream(deviceID long, roomNo int, temp double);

from TempStream
output snapshot every 5 sec
insert into SnapshotTempStream;
```

Here, the query outputs the last seen event at the end of each time interval as there are no events stored in no window defined.

## Partition

Partition provides data parallelism by categorizing events into various isolated partition instance based on their attribute values and by processing each partition instance in isolation. Here each partition instance is tagged with a partition key, and they only process events that match to the corresponding partition key.

**Purpose**

Partition provide ways to segment events into groups and allow them to process the same set of queries in parallel and in isolation without redefining the queries for each segment.

Here, events form multiple streams generating the same partition key will result in the same instance of the partition, and executed together. When a stream is used within the partition block without configuring a partition key, all of its events will be executed in all available partition instances.

**Syntax**

The syntax for a partition is as follows:

```siddhi
@purge(enable='true', interval='<purge interval>', idle.period='<idle period of partition instance>')
partition with ( <key selection> of <stream name>,
                 <key selection> of <stream name>, ... )
begin
    from <stream name> ...
    select <attribute name>, <attribute name>, ...
    insert into (#)?<stream name>

    from (#)?<stream name> ...
    select <attribute name>, <attribute name>, ...
    insert into <stream name>

    ...
end;
```

Here, a new instance of a partition will be dynamically created for each unique partition key that is generated based on the `<key selection>` applied on the events of their associated streams (`<stream name>`). These created partition instances will exist in the system forever unless otherwise a purging policy is defined using the `@purge` annotation. The inner streams denoted by `#<stream name>` can be used to chain multiple queries within a partition block without leaving the isolation of the partition instance.

The `<key selection>` defines the partition key for each event based on the event attribute value or using range expressions as listed below.

Key selection type | Syntax | description
-------------------|--------|------------
Partition by value| `<attribute name>` | Attribute value of the event is used as its partition key.
Partition by range| `<compare condition> as 'value' or <compare condition> as 'value' or ...` | Event is executed against all `<compare conditions>`, and the values associated with the matching conditions are used as its partition key. Here, when the event is matched against multiple conditions, it is processed on all the partition instances that are associated with those matching conditions.  

When there are multiple queries within a partition block, and they can be chained without leaving the isolation of the partition instance using the inner streams denoted by `#`. More information on inner Streams will be covered in the following sections.

**Inner Stream**

Inner stream connects the queries inside a partition instance to one another while preserving partition isolation. These are denoted by a `#` placed before the stream name, and these streams cannot be accessed outside the partition block.

Through this, without repartitioning the streams, the output of a query instance can be used as the input of another query instance that is also in the same partition instance.

!!! Note "Using **non** inner streams to chain queries within a partition block."
    When the **connecting stream is not an inner stream and if it is not configured to generate a partition key, then it outputs events to all available partition instances**. However, when the non-inner stream is configured to generate a partition key, it only outputs to the partition instances that are selected based on the repartitioned partition key.

**Purge Partition**

Purge partition purges partitions that are not being used for a given period on a regular interval. This is because, by default, when partition instances are created for each unique partition key they exist forever if their queries contain stateful information, and there are use cases (such as partitioning events by date value) where an extremely large number of unique partition keys are used, which generates a large number of partition instances, and this eventually leading to system out of memory.

The partition instances that will not be used anymore can purged using the `@purge` annotation. The elements of the annotation and their behavior is as follows.  

Purge partition configuration| Description
---------|--------
`enable` | To enable partition purging.
`internal` | Periodic time interval to purge the purgeable partition instances.
`idle.period` | The idle period, a particular partition instance (for a given partition key) needs to be idle before it becomes purgeable.

**Example 1 (Partition by value)**

Query to calculate the maximum temperature of each `deviceID`, among its last 10 events.

```siddhi
partition with ( deviceID of TempStream )
begin
    from TempStream#window.length(10)
    select roomNo, deviceID, max(temp) as maxTemp
    insert into DeviceTempStream;
end;
```

Here, each unique `deviceID` will create a partition instance which retains the last 10 events arrived for its corresponding partition key and calculates the maximum values without interfering with the events of other partition instances.    

**Example 2 (Partition by range)**

Query to calculate the average temperature for the last 10 minutes per each office area, where the office areas are identified based on the `roomNo` attribute ranges from the events of `TempStream` stream.


```siddhi
partition with ( roomNo >= 1030 as 'serverRoom' or
                 roomNo < 1030 and roomNo >= 330 as 'officeRoom' or
                 roomNo < 330 as 'lobby' of TempStream)
begin
    from TempStream#window.time(10 min)
    select roomNo, deviceID, avg(temp) as avgTemp
    insert into AreaTempStream
end;
```

Here, partition instances are created for each office area type such as `serverRoom`, `officeRoom`, and `lobby`. Events are processed only in the partition instances which are associated with matching compare condition values that are satisfied by the event's `roomNo` attribute, and within each partition instance, the average `temp` value is calculated based on the events arrived over the last 10 minutes.   

**Example 3 (Inner streams)**

A partition to calculate the average temperature of every 10 events for each sensor, and send the output via the `DeviceTempIncreasingStream` stream if consecutive average temperature (`avgTemp`) values increase by more than 5 degrees.

```siddhi
partition with ( deviceID of TempStream )
begin
    from TempStream#window.lengthBatch(10)
    select roomNo, deviceID, avg(temp) as avgTemp
    insert into #AvgTempStream;

    from every e1=#AvgTempStream, e2=#AvgTempStream[e1.avgTemp + 5 < avgTemp]
    select e1.deviceID, e1.avgTemp as initialAvgTemp, e2.avgTemp as finalAvgTemp
    insert into DeviceTempIncreasingStream;
end;
```

Here, the first query calculates the `avgTemp` for every 10 events for each unique `deviceID` and passes the output via the inner stream `#AvgTempStream` to the second query that is also in the same partition instance. The second query then identifies a pair of consecutive events from `#AvgTempStream`, where the latter event having 5 degrees more on `avgTemp` value than its previous event.

**Example 4 (Purge partition)**

A partition to identify consecutive three login failure attempts for each session within 1 hour. Here, the number of sessions can be infinite.

```siddhi
define stream LoginStream ( sessionID string, loginSuccessful bool);

@purge(enable='true', interval='10 sec', idle.period='1 hour')
partition with ( sessionID of LoginStream )
begin
    from every e1=LoginStream[loginSuccessful==false],
               e2=LoginStream[loginSuccessful==false],
               e3=LoginStream[loginSuccessful==false]
         within 1 hour
    select e1.sessionID as sessionID
    insert into LoginFailureStream;
end;
```

Here, the events in `LoginStream` is partitioned by their `sessionID` attribute and matched for consecutive occurrences of events having `loginSuccessful==false` with 1 hour using a [sequence query](#sequence) and inserts the matching pattern's `sessionID` to `LoginFailureStream`. As the number of sessions is infinite the `@purge` annotation is enabled to purge the partition instances. The instances are marked for purging if there are no events from a particular sessionID for the last 1 hour, and the marked instances are periodically purged once every 10 seconds.

## Table

A table is a stored collection of events, and its schema is defined via the **table definition**.

A table definition is similar to the stream definition where it contains the table name and a set of attributes having specific types and uniquely identifiable names within the scope of the table. Here, all events associated with the table will have the same schema (i.e., have the same attributes in the same order).

The events of the table are stored `in-memory`, but Siddhi also provides [store extensions](#store) to mirror the table to external databases such as RDBMS, MongoDB, and others, while allowing the events to be stored on those databases.

Table supports primary keys to enforce uniqueness on stored events/recodes, and indexes to improve their searchability.

**Purpose**

Tables help to work with stored events. They allow to pick and choose the events that need to be stored by performing insert, update, and delete operations, and help to retrieve necessarily events when by performing read operations.

!!! Note "Managing events stored in table"
    The events in the table can be managed using queries that perform join, insert, update, insert or update, and delete operates, which are either initiated by events arriving in Streams or through [on-demand queries](#on-demand-query).

**Syntax**

The syntax for defining a table is as follows:

```siddhi
@primaryKey( <key>, <key>, ... )
@index( <key>, <key>, ...)
define table <table name> (<attribute name> <attribute type>, <attribute name> <attribute type>, ... );
```
The following parameters are used to configure the table definition:

| Parameter     | Description |
| ------------- |-------------|
| `<table nam>`      | The name of the table created. (It is recommended to define a table name in `PascalCase`.) |
| `<attribute name>`   | Uniquely identifiable name of the table attribute. (It is recommended to define attribute names in `camelCase`.)|    
| `<attribute type>`   | The type of each attribute defined in the schema. <br/> This can be `STRING`, `INT`, `LONG`, `DOUBLE`, `FLOAT`, `BOOL` or `OBJECT`.     |

To use and refer table and attribute names that do not follow `[a-zA-Z_][a-zA-Z_0-9]*` format enclose them in ``` ` ```. E.g. ``` `$test(0)` ```.

**Primary Keys**

Primary keys help to avoid duplication of data by enforcing nor two events to have the same value for the selected primary key attributes. They also index the table to access the events much faster.

Primary keys are optional, and they can be configured using the `@primaryKey` annotation. Here, each table can only have at most one `@primaryKey` annotation, which can have one or more `<attribute name>`s defined as primary keys (The number of `<attribute name>` supported can differ based on the differet store implementations). When more than one attribute is used, the uniqueness of the events stored in the table is determined based on the composite value for those attributes.

When more than one events having the same primary keys are inserted to the table, the latter event replaces the event/record that already exists in the table.

**Indexes**

Indexes allow events in the tables to be searched/modified much faster, but unlike primary keys, the indexed attributes support duplicate values.

Indexes are optional, and they can be configured using the `@index` annotation. Here, each `@index` annotation creates an index in the table, and the tables only support one `<attribute name>` for each index (The number of @Index annotations and `<attribute name>` inside the annotation can differ based on different store implementations).

**Example 1 (Primary key)**

```siddhi
define table RoomTypeTable ( roomNo int, type string );
```
The above table definition defines an in-memory table named `RoomTypeTable` having the following attributes.

+ `roomNo` of type `int`
+ Room `type` of type `string`

**Example 2 (Primary key)**

```siddhi
@primaryKey('symbol')
define table StockTable (symbol string, price float, volume long);
```

The above table definition defines an in-memory table named `StockTable` having the following attributes.

+ `symbol` of type `string`
+ `price` of type `float`
+ `volume` of type `long`

As this table is configured with the primary key `symbol`, there will be only one record/event exist in the table for a particular value of the `symbol` attribute.

**Example 3 (Index)**

```siddhi
@index('username')
@index('salary')
define table SalaryTable (username string, salary double);
```

The above table definition defines an in-memory table named `SalaryTable` having the following attributes.

+ `username` of type `string`
+ `salary` of type `double`

As this table is configured with indexes for `username` and `salary`, the search operations on `username` and/or `salary` attributes will be much faster than the non-indexed case. Here, the table can contain duplicate events having the same value for username and/or salary.


**Example 3 (Primary key and index)**

```siddhi
@primaryKey('username')
@index('salary')
define table SalaryTable (username string, salary double);
```

The above table definition defines an in-memory table named `SalaryTable` having the following attributes.

+ `username` of type `string`
+ `salary` of type `double`

As this table is configured with the primary key `username` and index `salary`. Hence, there can be only one record/event exist in the table having a particular username value, and the search operations on `username` and/or `salary` attributes will be much faster than the non-indexed case.

### Store

Stores allow creating, reading, updating, and deleting events/recodes stored on external data stores such as RDBMS, MongoDB, and others. They produce these functionalities by using the Siddhi tables as a proxy to external databases.

Stores depending on their implementation and the connected external data store, some supports primary keys to enforce uniqueness on stored events/recodes, and indexes to improve their searchability.

Since stores work with external data stores, the i/o latency can be quite higher than in-memory tables, the increase in latency can be eliminated by defining a cache, such that recently accessed data will be cached in-memory providing faster data retrievals.

**Purpose**

Stores allow searching retrieving and manipulating data stored in external data stores through queries. This is useful for use cases when there is a need to access a common database used by various other systems, to retrieve and transfer data.  

**Syntax**

The syntax for defining a store along with is associated table is as follows:

```siddhi
@store(type='<store type>', <common.static.key>='<value>', <common.static.key>='<value>'
       @cache(size='<cache size>', cache.policy='<cache policy>', retention.period='<retention period>', purge.interval="<purge interval>"))
@primaryKey( <key>, <key>, ... )
@index( <key>, <key>, ...)
define table <table name> (<attribute name> <attribute type>, <attribute name> <attribute type>, ... );
```

Here the store is defined via the `@store` annotation, and the schema of the store is defined via the **table definition** associated with it. In this case the table definition will not create an `in-memory` table but rather used as a poxy to read, write, and modify data stored in external store.

The `type` parameter of the `@store` defines the store type to be used to connect to the external data store, and the other parameters of `@store` annotation other than `@cache` depend on the store selected, where some of these parameters can be optional.

The `@primaryKey` and `@index` annotations are optional, and supported by some store implementations. The `@primaryKey` annotation can be defined at most once, and it can have one or more `<attribute name>`s as composed primary keys based on the implementation. At the same time, `@index` annotation can be defined several times, and it can also have one or more `<attribute name>`s as composed indexes if the implementation supports them.

**Cache**

The `@cache` annotation inside `@store` defines the behavior of the cache.  `@cache` is an optional annotation that can be applied to all store implementations, where when this is not defined, the cache will not be enabled.

The parameters defining the cache behavior via the `@cache` annotation is as follows.

| Parameter | Mandatory/Optional | Default Value | Description |
|-----------|--------------------|---------------|-------------|
| `size`       |Mandatory    | - | Maximum number of events/records stored in the cache.|
| `cache.policy` | Optional | `FIFO` | Policy to remove elements from the cache when the cache is at its maximum size and new entries need to added due to cache miss.<br/>Supported policies are <br/>`FIFO` (First-In First-Out), <br/>`LRU` (Least Recently Used)<br/>`LFU` (Least Frequently Used) |
|`retention.period`|Optional  |-|The period after an event/record will become eligible for removal from the cached irrespective of the case size. This allows the cache to fetch the recent database updates made by other systems.|
|`purge.interval`|Optional|Equal to retention period.|The periodic time interval the cached events/records that are eligible for removal will be purge.|

Even though the cache is enabled, its behavior and usage depend on the number of recodes in the external store relative to the maximum cache size defined as follows:

1. Cache size being greater than or equal to the number of recodes in the external store:

    * At startup, all the recodes of the external store data will be preloaded to cached.
    * The cache is used to process all type of data retrieval operations.  
    * When `retention.period` (and `purge.interval`) is configured, all records the cache are periodically deleted and reloaded from the external store.

2. Cache size is smaller than the number of recodes in the external store:  

    * At startup, the number of recodes equal to the maximum cache size is preloaded from the external store.
    * **The cache is used to process only the data retrieval operations that use all defined primary keys in equal (`==`) comparisons, and when there are multiple comparisons, those are combined using `and`**, _(For example when `customerID` and `companyID` are defined as primary keys then the data retrieval operations with condition `customerID == 'John' and companyID == 'Google' and age > 28` can  be executed in the cache)_. All other operations are directly executed in the external data store.
    * If the cache is full and when a cache miss occurs, a record is removed from the cache based on the defined cache expiry policy before adding the missed record from the external data store.
    * When `retention.period` (and `purge.interval`) is configured, the data is cache that are loaded earlier than retention period are periodically deleted. Here, no reloading will be done from the external data store.  

**Supported store types**

The following is a list of store types supported by Siddhi:

|Sink mapping type | Description|
| ------------- |-------------|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-store-rdbms">RDBMS</a> | Optimally stores, retrieves, and manipulates data on RDBMS databases such as MySQL, MS SQL, Postgresql, H2 and Oracle.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-store-mongodb">MongoDB</a> | Stores, retrieves, and manipulates data on MongoDB.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-store-redis">Redis</a> | Stores, retrieves, and manipulates data on Redis.|
| <a target="_blank" href="https://siddhi-io.github.io/siddhi-store-elasticsearch">Elasticsearch</a> | Supports data access and manipulation operators on Elasticsearch.|

**Example 1**

An RDBMS Store configuration to work with MySQL database.

```siddhi
@store(type="rdbms", jdbc.url="jdbc:mysql://localhost:3306/hotel",
       username="siddhi", password="123",
       jdbc.driver.name="com.mysql.jdbc.Driver")
define table RoomTypeTable ( roomNo int, type string );
```
Here, the store connects to the MySQL table `RoomTypeTable` in the database `hotel` hosted on `localhost:3306`, and its columns mapped as follows.

+ `roomNo` of type `INTEGER` mapped to `int`
+ `type` of type `VARCHAR(255)` mapped to `string`

**Example 2**

An RDBMS Store configuration to work with an indexed MySQL database using a cache.

```siddhi
@store(type="rdbms", jdbc.url="jdbc:mysql://localhost:3306/hotel",
       username="siddhi", password="123",
       jdbc.driver.name="com.mysql.jdbc.Driver"
       @cache(size="100", retention.period="5 min", purge.interval="1 min"))
@primaryKey('username')
@index('salary')
define table SalaryTable (username string, salary double);
```

Here, an `RDBMS` store is defined with a cache of size 100 that every minute removes the entries added to the cache which are older than 5 minutes. The store connects to the MySQL table named `SalaryTable`, that is configured with the primary key `username` and index `salary`, and located in a MySQL the database `hotel` hosted on `localhost:3306`. Its columns mapped as follows.

+ `username` of type `VARCHAR(255)` mapped to `string`
+ `salary` of type `VARCHAR(255)` mapped to `string`

**Table (and store) operators**

The following operations can be performed on tables (and stores).

### Insert

Allows events (records) to be inserted into tables/stores. This is similar to inserting events into streams.

!!! warning "Primary Keys"
    If the table is defined with primary keys, and multiple records are inserted with the same primary key, a primary key constrain violations can can occur.
    In such cases use the `update or insert into` operation.

**Syntax**

Syntax to insert events into a table from a stream is as follows;

```siddhi
from <input stream>
select <attribute name>, <attribute name>, ...
insert into <table>
```

Similar to streams, the `current events`, `expired events` or the `all events` keyword can be used between `insert` and `into` keywords in order to insert only the specific event types. For more information, refer [Event Type](#event-type) section.

**Example**

Query to inserts all the events from the `TempStream` stream to the `TempTable` table.

```siddhi
define stream TempStream(tempId string, temp double);
define table TempTable(tempId string, temp double);

from TempStream
select *
insert into TempTable;
```

### Join (Table)

Allows stream or [named-window](#named-window) to retrieve events (records) from a table.

!!! Note "Other Join Functions"
    Joins can also be performed among [two streams](#join-stream), with [named-aggregation](#join-named-aggregation), or [named-window](#join-named-window).

**Syntax**

The syntax for a stream or a named-window to join with a table is as follows:

```siddhi
from (<input stream>(<non window handler>)*(<window>)?|<named-window>) (as <reference>)?
         <join type> <table> (as <reference>)?
    (on <join condition>)?
select <reference>.<attribute name>, <reference>.<attribute name>, ...
insert into <output stream>
```

A join with table is similar to the join of [two streams](#join-stream), where one of the inputs is a table and other can be either a stream or a [named-window](#named-window). Here, the table and named-window cannot have any optional handlers associated with it.

!!! Note "Two tables cannot be joined."
    A table can only be joint with a stream or named-window. Two tables, or table and named-aggregation cannot be joint because there must be at least one active entity to trigger the join operation.

**Supported join types**

Table join supports following join operations.

 *  **Inner join (join)**

    This is the default behavior of a join operation, and the `join` keyword is used to join a stream with a table.

    The output is generated only if there is a matching event in both the stream and the table.

 *  **Left outer join**

    The `left outer join` keyword is used to join a stream on the left side with a table on the right side based on a condition.

    It returns all the events of the left stream even if there are no matching events in the right table by having `null` values for the attributes of the table on the right.

 *  **Right outer join**

    This is similar to a `left outer join` and the `right outer join` keyword is used to join a stream on right side with a table on the left side based on a condition.

    It returns all the events of the right stream even if there are no matching events in the left table by having `null` values for the attributes of the table on the left.

!!! Note "Cross join"
    In either of these cases, when the join condition is omitted, the triggering event will successfully match against all the events in the table, producing a cross join behavior.

**Example**

A query to join and retrieve the room type from `RoomTypeTable` table based on equal `roomNo` attribute of `TempStream`, and to insert the results into `RoomTempStream` steam.

```siddhi
define table RoomTypeTable (roomNo int, type string);
define stream TempStream (deviceID long, roomNo int, temp double);

from TempStream as t join RoomTypeTable as r
    on t.roomNo == r.roomNo
select t.deviceID, t.roomNo, r.type as roomType, t.temp
insert into RoomTempStream;
```

### Delete

Allows a stream to delete selected events (records) form a table.

**Syntax**

Syntax to delete selected events in a table based on the events in a stream is as follows;

```siddhi
from <input stream>
select <attribute name>, <attribute name>, ...
delete <table> (for <event type>)?
    (on <condition>)?
```

The `condition` element specifies the basis on which the events in the table are selected to be deleted. **When specifying the condition, the table attributes should always be referred with the table name**, and and when a condition is not defined, all the events in the table will be deleted.

To execute delete, only for specific event types, use the `current events`, `expired events` or the `all events` keyword can be used with `for` as shown in the syntax. For more information refer [Event Type](#event-type).

!!! note
    When defining the condition, the table attributes must be always referred with the table name as follows:
    `<table name>.<attribute name>`

**Example 1**

A query to delete the records in the `RoomTypeTable` table that has matching values for the `roomNo` attribute against the values of `roomNumber` attribute of the events in the `DeleteStream` stream.

```siddhi
define table RoomTypeTable (roomNo int, type string);
define stream DeleteStream (roomNumber int);

from DeleteStream
delete RoomTypeTable
    on RoomTypeTable.roomNo == roomNumber;
```

**Example 2**

A query to delete all the records in the `BlacklistTable` table when an event arrives in the `ClearStream` stream.

```siddhi
define table BlacklistTable (ip string);
define stream ClearStream (source string);

from ClearStream
delete BlacklistTable;
```

### Update

Allows a stream to update selected events (records) form a table.

**Syntax**

Syntax to update events on a table is as follows;

```siddhi
from <input stream>
select <attribute name>, <attribute name>, ...
update <table> (for <event type>)?
    (set <table>.<attribute name> = (<attribute name>|<expression>), <table>.<attribute name> = (<attribute name>|<expression>), ...)?
    (on <condition>)?
```

The `condition` element specifies the basis on which the events in the table are selected to be updated. **When referring the table attributes in the `update` clause, they must always be referred to with the table name**, and when a condition is not defined, all the events in the table will be updated.

The `set` keyword can be used to update only the selected attributes from the table. Here, for each assignment, the left side should contain the table attribute that is being updated, and the right side can contain a query output attribute, a table attribute, a mathematical operation, or any other. When the `set` clause is not provided, all attributes in the table will be updated based on the query output.  

To execute update, only for specific event types, use the `current events`, `expired events` or the `all events` keyword can be used with `for` as shown in the syntax. For more information refer [Event Type](#event-type).

!!! note
    In the `update` clause, the table attributes must be always referred with the table name as follows:
    `<table name>.<attribute name>`

**Example 1**

A query to update the `latestHeartbeatTime` on the `ServerInfoTable` against each `serverIP` for every event on the `HeartbeatStream`.

```siddhi
define table ServerInfoTable (serverIP string, host string, port int, latestHeartbeatTime long);
define stream HeartbeatStream (serverIP string, timestamp long);

from HeartbeatStream
select *
update ServerInfoTable
    set ServerInfoTable.latestHeartbeatTime = timestamp
    on ServerInfoTable.serverIP == serverIP;
```

**Example 2**

A query to update the `peoplePresent` in the `RoomOccupancyTable` table for each `roomNo` based on new people `arrival` and `exit` values from events of the `UpdateStream` stream.

```siddhi
define table RoomOccupancyTable (roomNo int, peoplePresent int);
define stream UpdateStream (roomNumber int, arrival int, exit int);

from UpdateStream
select *
update RoomOccupancyTable
    set RoomOccupancyTable.peoplePresent = RoomOccupancyTable.peoplePresent + arrival - exit
    on RoomOccupancyTable.roomNo == roomNumber;
```

**Example 3**

A query to update the `latestHeartbeatTime` on the `HeartbeatTable` for each event on the `HeartbeatStream`.

```siddhi
define table HeartbeatTable (serverIP string, latestHeartbeatTime long);
define stream HeartbeatStream (serverIP string, timestamp long);

from HeartbeatStream
select serverIP, timestamp as latestHeartbeatTime
update HeartbeatTable
    on ServerInfoTable.serverIP == serverIP;
```

### Update or Insert

Allows a stream to update the events (records) that already exist in the table based on a condition, else inserts the event as a new entry to the table.

**Syntax**

Syntax to update or insert events on a table is as follows;

```siddhi
from <input stream>
select <attribute name>, <attribute name>, ...
update or insert into <table> (for <event type>)?
    (set <table>.<attribute name> = (<attribute name>|<expression>), <table>.<attribute name> = (<attribute name>|<expression>), ...)?
    (on <condition>)?
```

The `condition` element specifies the basis on which the events in the table are selected to be updated. **When referring the table attributes in the update clause, they must always be referred with the table name**, and when the condition does not match with any event in the table, then a new event (a record) is inserted into the table. Here, when a condition is not defined, all the events in the table will be updated.

The `set` clause is only used when an update is performed in the update or insert operation. In this case, the `set` keyword can be used to update only the selected attributes from the table. Here, for each assignment, the left side should contain the table attribute that is being updated, and the right side can contain a query output attribute, a table attribute, a mathematical operation, or any other. When the `set` clause is not provided, all attributes in the table will be updated based on the query output.  

To execute update or insert, only for specific event types, use the `current events`, `expired events` or the `all events` keyword can be used with `for` as shown in the syntax. For more information refer [Event Type](#event-type).

!!! note
    In the `update or insert` clause, the table attributes must be always referred with the table name as follows:
    `<table name>.<attribute name>`

**Example**

A query to update `assignee` information in the `RoomAllocationTable` table for the corresponding `roomNumber` from the `RoomAllocationStream` stream when at least one matching record is present in the table, and when there are no matching records it inserts a new record to the `RoomAllocationTable` table based on the query output.

```siddhi
define table RoomAllocationTable (roomNo int, type string, assignee string);
define stream RoomAllocationStream (roomNumber int, type string, assignee string);

from RoomAllocationStream
select roomNumber as roomNo, type, assignee
update or insert into RoomAllocationTable
    set RoomAllocationTable.assignee = assignee
    on RoomAllocationTable.roomNo == roomNo;
```

### In (Table)

Allows the query to check whether the expected value exists in the table using a condition operation.

**Syntax**

```siddhi
from <input stream>[<condition> in <table>]
select <attribute name>, <attribute name>, ...
insert into <output stream>
```

The `condition` element specifies the basis on which the events in the table are checked for existence. **When referring the table attributes in the `condition`, they must always be referred with the table name** as `<table name>.<attribute name>`.

**Example 1**

A query to filter only the events of server rooms from the `TempStream` stream using the `ServerRoomTable` table, and pass them for further processing via `ServerRoomTempStream` stream.

```siddhi
define table ServerRoomTable (roomNo int);
define stream TempStream (deviceID long, roomNo int, temp double);

from TempStream[ServerRoomTable.roomNo == roomNo in ServerRoomTable]
insert into ServerRoomTempStream;
```

**Example 2**

A query to filter out the blacklisted `serverIP`s from the `RequestStream` stream using the `BlacklistTable` table, and only pass events having IPs that are not blacklisted, for further processing via `FilteredRequestStream` stream.

```siddhi
define table BlacklistTable (serverIP string);
define stream RequestStream (ip string, request string);

from RequestStream[not (BlacklistTable.serverIP == ip in BlacklistTable)]
insert into FilteredRequestStream;
```

## Named-Aggregation

Named-aggregation aggregates events incrementally for a specified set of time granularities, and allows interactively accessing them to produce reports, dashboards, and to take decisions in realtime with millisecond accuracy. The aggregation logic and schema is defined via the **aggregation definition**.

A aggregation definition contains the aggregation name, input, aggregation logic, the time granularities on which the aggregations are calculated, and the set of aggregated output attributes having specific types and uniquely identifiable names within the scope of the named-aggregation.

The aggregated events of the named-aggregation are stored by default `in-memory`, but Siddhi also provides [store extensions](#store) to mirror the named-aggregation to external databases such as RDBMS, while allowing the aggregated events to be stored on databases such that allowing it to hold data for longer durations, preserve data at failures, and to aggregate data in a distributed manner.

The historical data stored in named-aggregations are purged automatically to limit data growth overtime, and when purging is not configured, system automatically purges the data every 15 minutes, by only retaining the default number of records for each time granularity.

**Purpose**

Named-aggregations helps to calculate aggregations over long durations and retrieve the aggregated values over various time ranges, It can perform aggregation using operations such as `sum`, `count`, `avg`, `min`, `max`, `count` and `distinctCount` on stream attributes for time granularities such as `sec`, `min`, `hour`, `day`, `month`, and `year`.

This can be used for in many analytics scenarios as this provides time-series aggregates on calendar time, over long durations, even for out-of-order events, and helps to retrieve historical data for selected time range and time granularity.

**Syntax**

The syntax for defining a named-aggregation is as follows:

```siddhi
@store(type='<store type>', ...)
@purge(enable="<enable purging>", interval='<purging interval>',
       @retentionPeriod(<granularity> = '<retention period>', ...))
@PartitionById(enable="<enable distributed aggregation>")
define aggregation <aggregation name>
from (<stream>|<named-window>)
select <attribute name>, <aggregate function>(<attribute name>) as <attribute name>, ...
    group by <attribute name>
    aggregate by <timestamp attribute> every <time granularities> ;
```

The following parameters are used to configure the aggregation definition:

|Parameter                     |Description
---------------                |---------
|`@store`                      |Annotation to configure the data store to store the aggregated records. This annotation is optional and when not provided, the results are stored in `in-memory` tables.
|`@purge`                      |Annotation to configure data purging on aggregated data. This annotation is optional, and when not provided, the default data purging configuration is enabled. To disable data purging, use `@purge(enable='false')` configuration, and also make sure to disable when named-aggregation is used only for read-only purposes. Detail information on data purging is explained in the following section.
|`@PartitionById` |Annotation to enable multiple named-aggregations to process in a distributed manner. Detail information on this is discussed in the distributed named-aggregation section.
|`<aggregation name>`           |The name of the named-aggregation created. (It is recommended to define an aggregation name in `PascalCase`.)
|`<input stream>`              |The stream that feeds the named-aggregation, **and this stream must be defined before the aggregation definition**.
|`group by <attribute name>`   |The `group by` clause to aggregate the events per each unique `group by` attribute value combination. This is optional, and when not provided, all events are aggregated together.
|`by <timestamp attribute>`    |Configures a stream attribute to be used as the event timestamp in the aggregation. This is optional, and if not provided, the event time is used by default. When the stream attribute is used as the event timestamp it could be either a `long` in Unix timestamp in milliseconds (e.g. `1496289950000`), or a `string` in the format `<yyyy>-<MM>-<dd> <HH>:<mm>:<ss>` (if time is in GMT) or `<yyyy>-<MM>-<dd> <HH>:<mm>:<ss> <Z>` (if the time is not in GMT) with ISO 8601 UTC offset for `<Z>` (e.g., `+05:30`, `-11:00`).
|`<time granularities>`         |Defines the granularity ranges on which the aggregations should be performed using `second`, `minute`, `hour`, `day`, `month`, and/or `year` keywords. Here, the granularity range can be defined with minimum and maximum granularities separating them with three dots (e.g. `sec ... year` where the aggregation will be performed per each second, minute, hour, day, month, and year), or using comma-separated granularities (e.g. `min, hour` where the aggregation will be only performed per each minute and hour).

!!! Note "The named-aggregation uses calendar time."
    The named-aggregations aggregate events at calendar start times for each granularity based on GMT timezone.

!!! Note "Handles out-of-order event arrival."
    Named-aggregations aggregates out-of-order event arrivals into their corresponding time range and granularity.

**Data Purging**

Data purging on named-aggregations are enabled by default with `15 min` purging interval and the following retention periods;

|Time granularity           |Default retention period     |Minimum retention period
---------------        |--------------         |------------------  
|`second`              |`120` seconds          |`120` seconds
|`minute`              |`24`  hours            |`120` minutes
|`hour`                |`30`  days             |`25`  hours
|`day`                 |`1`   year             |`32`  days
|`month`               |`All`                  |`13`  month
|`year`                |`All`                  |`none`

This can be modified using the `@purge` annotation by optionally providing `interval` parameter to configure the purging interval, and by optionally configuring the `@retentionPeriod` annotation, the duration the aggregated data needs to be retained when carrying out data purging is defined for each time granularity period using the `<granularity> = '<retention period>'` pairs. Here for each granularity, the configured granularity period should be greater than or equal to the respective minimum retention period, and when not defined, the default retention period is applied as specified in the above table.

!!! warning "Beware of defining the same named-aggregation in multiple SiddhiApps."
    The same named-aggregation can be defined in multiple SiddhiApps for data aggregation and data retrieval purposes.
    In this case, make sure all the named-aggregations to have the same purging configuration or enable purging only in one of the named-aggregations to ensure that data is purged as expected.  
    Further, when these named-aggregations are configured to use the same physical data store using the `@stroe` annotation while the distributed named-aggregation configuration discussed in the following sections is not used,  make sure a named-aggregation in only one of the SiddhiApps performs data aggregation (i.e., the aggregation input stream only feeds events into one of the aggregation definitions) while others are only used for data retrieval either using join, or on-demand select queries.

**Distributed Named-Aggregations**

The system will result in an error when more than one named-aggregation, with same aggregation name pointing to the same physical store using the `@store` annotation, is defined on multiple SiddhiApps unless otherwise Siddhi is configured to perform aggregations in a distributed manner.

Distributed named-aggregation configurations allow each SiddhiApp to work as independent shards by partially aggregating the data fed to them. These partial results are combined during data retrieval.

Named-aggregations can be configured to process data parallelly and in a distributed manner, by adding the following Siddhi properties to Siddhi configuration. Refer [Siddhi configuration guide](../config-guide/#configuring-siddhi-properties) for detail steps.

Siddhi Property| Description| Possible Values | Optional | Default Value
---------|---------|---------|---------|------
`shardId`| An ID to uniquely identify the running process (Siddhi Manager/ Siddhi Runner). This helps different instances of the same SiddhiApp running on separate processes to aggregate and store data separately. | Any string | No | `""` (Empty string)
`partitionById` | Enables all named-aggregations on the running process (Siddhi Manager/ Siddhi Runner) to aggregate data in a distributed manner. | `true`, `false` | Yes | `false`

The named-aggregations that are enabled to process in a distributed manner using the Siddhi properties can be selectively disabled by adding the `@PartitionById` annotation to the corresponding aggregation definition and setting its `enable` property to false as `@PartitionById(enable='false')`.

!!! warning "Once a `shardId` is introduced it should not be dropped arbitrarily!"
    When a process (Siddhi Manager/ Siddhi Runner) configured with a specific `shardId` is permanently removed, it will result in unexpected aggregate results unless otherwise the data belonging to that shard is migrated or cleaned in the data store.

**Example 1**

An in-memory named-aggregation with default default purging named as `TradeAggregation` to calculate the average and sum for `price` attribute for each unique `symbol` for all time granularities from second to year using `timestamp` attribute as the event time, on the events arriving via the `TradeStream` stream.

```siddhi
define stream TradeStream (symbol string, price double, volume long, timestamp long);

define aggregation TradeAggregation
  from TradeStream
  select symbol, avg(price) as avgPrice, sum(price) as total
    group by symbol
    aggregate by timestamp every sec ... year;
```

**Example 2**

A custom purging enabled RDBMS store based named-aggregation with name `TradeAggregation` to calculate the min and max `price` for each unique `symbol` for time granularities hour, day, and month using Siddhi event timestamp, on the events arriving via the `TradeStream` stream.

```siddhi
define stream TradeStream (symbol string, price double, volume long, timestamp long);

@store(type="rdbms", jdbc.url="jdbc:mysql://localhost:3306/sweetFactoryDB",
       username="root", password="root",
       jdbc.driver.name="com.mysql.jdbc.Driver")
@purge(enable='true', interval='10 min',
       @retentionPeriod(hour='24 hours', days='1 year', months='all'))
define aggregation TradeMinMax
  from TradeStream
  select symbol, min(price) as minPrice, max(price) as maxPrice
    group by symbol
    aggregate every hour, day, month;
```

Here, the aggregated data is stored in a MySQL store hosted at `mysql://localhost:3306/sweetFactoryDB` and the data is periodically purged for every `10 min` while retaining data for hour, day, and month granularities for `24 hours`, `1 year`, and forever respectively.

**Named-aggregation operators**

The following operation can be performed on named-aggregation.

### Join (Named-Aggregation)

Allows stream or named-window to retrieve aggregated results from the named-aggregation.

!!! Note "Other Join Functions"
    Joins can also be performed among [two streams](#join-stream), with [table](#join-table), or [named-window](#join-named-window).

**Syntax**

The syntax for a stream or a named-window to join with a named-aggregation is as follows:

```siddhi
from (<input stream>(<non window handler>)*(<window>)?|<named-window>) (as <reference>)?
    <join type> <named-aggregation> (as <reference>)?
  on <join condition>
  within <time range>
  per <time granularity>
select <reference>.<attribute name>, <reference>.<attribute name>, ...
insert into <output stream>;
```

A join with named-aggregation is similar to the [table](#join-table) join with additional `within` and `per` clauses, where table is being replaced by a named-aggregation. Here, the named-aggregation cannot have any optional handlers associated with it.

Apart from the [standard join constructs](#join-stream) this supports the `within` and `per` clauses as follows.

Item|Description
---------|---------
`within  <time range>`| Specifies the time interval for which the aggregate values should to be retrieved. This can be specified either by providing a start and an end timestamps (in `string` or `long` values) separating them by a comma as in `"2014-02-15 00:00:00 +05:30", "2014-03-16 00:00:00 +05:30"` and `1496200000000L, 1596434876000L`, or by using a wildcard `string` specifying the data range as in `"2014-02-15 **:**:** +05:30"`.            
`per <time granularity>`|Specifies the time granularity by which the data should be grouped and aggregated when data is retrieved. For instance, when `days` is specified for granularity, the named-aggregation returns aggregated results grouped for each day within the selected time interval. Here, the timestamp of each group can be obtained using the `AGG_TIMESTAMP` attribute, that is internal to the named-aggregation.

!!! Note "Named-aggregations can only be joint with a stream or named-window."
    Two named-aggregations, or table and named-aggregation cannot be joint because there must be at least one active entity to trigger the join operation.

**Supported join types**

Named-aggregation join supports inner join (`join`), `left outer join`, `right outer join`, and cross join (when join condition is omitted) similar to the [table join](#join-table).

**Examples**

Following aggregation definition is used for all the examples.

```siddhi
define stream TradeStream (symbol string, price double, volume long, timestamp long);

define aggregation TradeAggregation
  from TradeStream
  select symbol, avg(price) as avgPrice, sum(price) as total
    group by symbol
    aggregate by timestamp every sec ... year;
```

**Example 1**

A query to join and retrieve daily aggregations within the time range of `"2014-02-15 00:00:00 +05:30", "2014-03-16 00:00:00 +05:30"` from `TradeAggregation` based on equal `symbol` attribute of `StockStream`, and to insert the results into `AggregateStockStream` steam. Here, `+05:30` in time range can be omitted if the timezone is GMT.

```siddhi
define stream StockStream (symbol string, value int);

from StockStream as s join TradeAggregation as t
  on s.symbol == t.symbol
  within "2014-02-15 00:00:00 +05:30", "2014-03-16 00:00:00 +05:30"
  per "days"
select AGG_TIMESTAMP as timestamp, s.symbol, t.total, t.avgPrice
insert into AggregateStockStream;
```

**Example 2**

A query to join and retrieve all the hourly aggregations within the day of `2014-02-15` from `TradeAggregation` each event in `RequestStream` stream, order the results by `symbol`, and to insert the results into `AggregateStockStream` steam.

```siddhi
define stream RequestStream (request string);

from RequestStream join TradeAggregation as t
  within "2014-02-15 **:**:** +05:30"
  per "hours"
select AGG_TIMESTAMP as timestamp, t.symbol, t.total, t.avgPrice
order by symbol
insert into AggregateStockStream;
```

**Example 3**

A query to join and retrieve aggregated results from `TradeAggregation` for respective `granularity` and `symbol` attributes between the `start` and the `end` timestamps of events arriving on `StockStream`, and to insert the results into `AggregateStockStream` steam.

```siddhi
define stream StockStream (symbol string, granularity string, start long, end long);

from StockStream as s join TradeAggregation as t
  on s.symbol == t.symbol
  within s.start, s.end
  per s.granularity
select AGG_TIMESTAMP as timestamp, s.symbol, t.total, t.avgPrice
insert into AggregateStockStream;
```

Here, `granularity`, `start` and `end` can have values such as `"hour"`, `1496200000000`, and `1596434876000` respectively.

## Named-Window

A named-window is a window that is shared across multiple queries, where multiple queries can insert, join and consume output from the window. Its schema is defined via the **window definition**.

A window definition is similar to the stream definition where it contains the name of named-window, a of attributes having specific types and uniquely identifiable names within the scope of the named-window along with the [window](#window) type and output [event type](#event-type). Here, all events associated with the named-window will have the same schema (i.e., have the same attributes in the same order).

The events of named-window are expired automatically based on the configured [window](#window) type, and they cannot be explicitly removed by other means.

**Purpose**

Named-windows help to use the same instance of a window in multiple queries, this reduces memory consumption, supports calculating various types of aggregations and output them via multiple streams, and allows multiple queries to query on the same window data.

!!! Note "Cannot selectively remove events from named-window."
    The events in the named-window cannot be selectively removed using delete operations, and the only way they are removed is via the automatic expiry operations of the defined [window](#window) type.

**Syntax**

The syntax for defining a named-window is as follows:

```siddhi
define window <window name> (<attribute name> <attribute type>, <attribute name> <attribute type>, ... ) <window type>(<parameter>, <parameter>, …) (output <event type>)?;
```

The following parameters are used configure the window definition:

| Parameter     | Description |
| ------------- |-------------|
| `<window name>`      | The name of the named-window created. (It is recommended to define a window name in `PascalCase`.) |
| `<attribute name>`   | Uniquely identifiable name of the named-window attribute. (It is recommended to define attribute names in `camelCase`.)|
| `<attribute type>`   | The type of each attribute defined in the schema. <br/> This can be `STRING`, `INT`, `LONG`, `DOUBLE`, `FLOAT`, `BOOL` or `OBJECT`.        |
| `<window type>(<parameter>, ...)`   | The window implementation associated with the named-window and its parameters.     |
| `<event type>` | Defines when the window should be emitting the events, by specifying keywords such as `current events`, `expired events`, or `all events`. Here, when the `output` is omitted, `all events` are emitted by default. For more information, refer [Event Type](#event-type) section.

**Example 1**

```siddhi
define window SensorWindow (deviceID string, value float, roomNo int) timeBatch(1 second);
```

The above window definition with the name `SensorWindow` defines a named-window that is configured to retain events for 1 second in `timeBatch` window, and produce output upon event arrival and expiry to the window. This named-window contains the following attributes.

+ `deviceID` of type `string`
+ `value` of type `float`
+ `roomNo` of type `int`

**Example 2**

```siddhi
define window SensorWindow (deviceID string, value float, roomNo int) time(1 min) output expired events;
```

The above window definition with the name `SensorWindow` defines a named-window that is configured to retain events for last 1 minute via `time` window, and produce output upon event expiry form the window. This named-window contains the following attributes.

+ `deviceID` of type `string`
+ `value` of type `float`
+ `roomNo` of type `int`

**Named-windows operators**

The following operations can be performed on named-windows.

### Insert

Allows events to be inserted into named-windows. This is similar to inserting events into streams.

**Syntax**

Syntax to insert events into a named-window from a stream is as follows;

```siddhi
from <input stream>
select <attribute name>, <attribute name>, ...
insert into <window>
```

Similar to streams, the `current events`, `expired events` or the `all events` keyword can be used between `insert` and `into` keywords in order to insert only the specific event types. For more information, refer [Event Type](#event-type) section.

**Example**

This query inserts all events from the `TempStream` stream to the `OneMinTempWindow` window.

```siddhi
define stream TempStream(tempId string, temp double);
define window OneMinTempWindow(tempId string, temp double) time(1 min);

from TempStream
select *
insert into OneMinTempWindow;
```

### Join (Named-Window)

Allows stream or named-window to retrieve events from another named-window.

!!! Note "Other Join Functions"
    Joins can also be performed among [two streams](#join-stream), with [named-aggregation](#join-named-aggregation), or [table](#join-table).

**Syntax**

The syntax for a stream or a named-window to join with another named-window is as follows:

```siddhi
from (<input stream>(<non window handler>)*(<window>)?|<named-window>) (as <reference>)?
  <join type> <named-window> (as <reference>)?
  on <condition>
select <reference>.<attribute name>, <reference>.<attribute name>, ...
insert into <output stream>
```

A join with named-window is similar to the join of [two streams](#join-stream), where either both the inputs are named-windows, or one is a stream and other is a named-window. Here, the named-window cannot have any optional handlers associated with it.

**Supported join types**

Named-window join supports inner join (`join`), `left outer join`, `right outer join`, `full outer join`, and cross join (when join condition is omitted) similar to the [stream join](#join-stream).

**Example**

A query, for each event on `CheckStream`, to join and calculate the number of temperature events having greater than 40 degrees for the `temp` attribute value, within the last 2 minutes of the `TwoMinTempWindow` named-window, and to insert the results into `HighTempCountStream` steam.

```siddhi
define window TwoMinTempWindow (roomNo int, temp double) time(2 min);
define stream CheckStream (requestId string);

from CheckStream as c join TwoMinTempWindow as t
    on t.temp > 40
select requestId, count(t.temp) as count
insert into HighTempCountStream;
```

### From (Named-Window)

Named-windows can be used as an input to any query, similar to streams.  

**Syntax**

Syntax for using named-window as an input to a simple query is as follows;

```siddhi
from <named-window><non window handler>* ((join (<stream><handler>*|<named-window>|<table>|<named-aggregation>))|((,|->)(<stream>|<named-window>)<non window handler>*)+)?
<projection>
<output action>
```

Named-windows can be used as input for any query type, like [how streams are being used](#from). They can be associated with optional non window handlers (such as filters, stream functions, and stream processors) in queries other than when they are used in join query.

**Example**

Queries to calculate the `max` temperature among all rooms, and `avg` temperature per each `room`, in the last 5 minutes, using `FiveMinTempWindow`, and publish the results via `MaxTempStream` stream, and `AvgTempStream` stream respectively.

```siddhi
define window FiveMinTempWindow (roomNo int, temp double) time(5 min);

from FiveMinTempWindow
select max(temp) as maxValue
insert into MaxTempStream;

from FiveMinTempWindow
select roomNo, avg(temp) as avgTemp
group by roomNo
insert into AvgTempStream;
```

## Trigger

Trigger produces events periodically based on a given internal with a predefined schema. They can be used in any query, similar to the streams, and defined via the **trigger definition**.

**Purpose**

Triggers help to periodically generate events based on a specified time interval or cron expression, to perform periodic execution of queries. They can also be produced at SiddhiApp startup to perform initialization operations.

**Syntax**

The syntax for defining a trigger is as follows:

```siddhi
define trigger <trigger name> at ( 'start'| every <time interval>| '<cron expression>');
```

Triggers can be used as input to any query, similar to the streams. Because, when defined, they are represented as a stream having one attribute with name `triggered_time`, and type `long` as follows.

```siddhi
define stream <trigger name> (triggered_time long);
```

The supported trigger types are as follows.

|Trigger type| Description|
|-------------|-----------|
|`'start'`| Produces a single event when SiddhiApp starts.|
|`every <time interval>`| Produces events periodically at the given time interval.|
|`'<cron expression>'`| Produces events periodically based on the given cron expression. For configuration details, refer <a target="_blank" href="http://www.quartz-scheduler.org/documentation/quartz-2.1.7/tutorials/tutorial-lesson-06.html">quartz-scheduler</a>.

**Example 1**

A trigger to generate events every 5 minutes.

```siddhi
define trigger FiveMinTrigger at every 5 min;
```

**Example 2**

A trigger to generate events at 10.15 AM on every weekdays.

```siddhi
define trigger WorkStartTrigger at '0 15 10 ? * MON-FRI';
```

**Example 3**

A trigger to generate an event at SiddhiApp startup.

```siddhi
define trigger InitTrigger at 'start';
```

## Script

The script provides the ability to write custom functions in other programming languages and execute them within Siddhi queries. The custom functions using scripts can be defined via the **function definitions** and accessed in queries similar to any other inbuilt [functions](#function).

**Purpose**

Scripts help to define custom functions in other programming languages such as javascript. This can eliminate the need for writing extensions to fulfill the functionalities that are not provided in Siddhi core or by its extension.

**Syntax**

The syntax for defining the script is as follows.

```siddhi
define function <function name>[<language name>] return <return type> {
    <function logic>
};
```

The defined function can be used in the queries similar to inbuilt [functions](#function) as follows.

```siddhi
<function name>( (<function parameter>(, <function parameter>)*)? )
```

Here, the `<function parameter>`s are passed into the `<function logic>` of the definition as an `Object[]` with the name `data`.

The functions defined via the function definitions have higher precedence compared to inbuilt functions and the functions provided via extensions.

The following parameters are used to configure the function definition:

| Parameter     | Description |
| ------------- |-------------|
| `<function name>`| 	The name of the function created. (It is recommended to define a function name in `camelCase`.)|
|`<language name>`| Name of the programming language used to define the script, such as `javascript`, `r`, or `scala`.|
| `<return type>`| The return type of the function. This can be `int`, `long`, `float`, `double`, `string`, `bool`, or `object`. Here, the function implementer is responsible for returning the output according on the defined return type to ensure proper functionality.|
|`<function logic>`|The execution logic that is written in the language specified under the `<language name>`, where it consumes the `<function parameter>`s through the `data` variable and returns the output in the type specified via the `<return type>` parameter.|

**Example 1**

A function to concatenate three strings into one using JavaScript.

```siddhi
define function concatFn[javascript] return string {
    var str1 = data[0];
    var str2 = data[1];
    var str3 = data[2];
    var response = str1 + str2 + str3;
    return response;
};

define stream TempStream(deviceID long, roomNo int, temp double);

from TempStream
select concatFn(roomNo,'-',deviceID) as id, temp
insert into DeviceTempStream;
```

Here, the defined `concatFn` function is used in the query by passing three string parameters for concatenation.

## On-Demand Query

On-demand queries provide a way of performing add hock operations on Siddhi [tables](#table) ([stores](#store)), [named-windows](#named-window), and [named-aggregations](#named-aggregation).

The On-demand query can be submitted to the SiddhiApp using the `query()` method of the respective Siddhi application runtime as follows.

```java
siddhiAppRuntime.query(<on-demand query>);
```

To successfully execute an on-demand query, the SiddhiApp of the respective siddhiAppRuntime should have the corresponding table, named-window, or named-aggregation defined, that is being used in the on-demand query.

**Purpose**

On-demand queries allow to retrieve, add, delete and update events/data in Siddhi [tables](#table) ([stores](#store)), [named-windows](#named-window), and [named-aggregations](#named-aggregation) without the intervention of streams. This can be used to retrieve the status of the system, extract information for reporting and dashboarding purposes, and many others.

The operations supported on tables are:

* Select
* Insert
* Delete
* Update
* Update or insert

The operation supported on [named-windows](#named-window), and [named-aggregations](#named-aggregation) is:

* Select

**On-Demand query operators**

The following operations can be performed via on-demand queries.

### Select _(Table/Named-Window)_

On-demand query to retrieve records from the specified [table](#table)(/[store](#store)) or [named-window](#named-window), based on the given condition.

To retrieve data from Named-Aggregation, refer the [Named-Aggregation Select](#select-named-aggregation) section.

**Syntax**

Syntax to retrieve events from table or named-window is as follows;

```siddhi
from (<table>|<named-window>)
(on <condition>)?
select <attribute name>, <attribute name>, ...
<group by>?
<having>?
<order by>?
<limit>?
```

Here, the input can be either [table](#table)(/[store](#store)) or [named-window](#named-window), and the other parameters are similar to the standard Siddhi [query](#query).

**Examples**

The on-demand queries used in the examples are performed on a SiddhiApp that contains a table definition similar to the following.

```siddhi
define table RoomTypeTable (roomNo int, type string);
```

**Example 1**

An on-demand query to retrieve room numbers and their types from the `RoomTypeTable` table, for all room numbers that are greater than or equal to 10.

```siddhi
from RoomTypeTable
on roomNo >= 10;
select roomNo, type
```

**Example 2**

An on-demand query to calculate the total number of rooms in the `RoomTypeTable` table.

```siddhi
from RoomTypeTable
select count(roomNo) as totalRooms
```

### Select _(Named-Aggregation)_

On-demand query to retrieve records from the specified [named-aggregation](#named-aggregation), based on the time range, time granularity, and the given condition.

To retrieve data from table (store), or named-window, refer the [Table/Named-Window Select](#select-tablenamed-window) section.

**Syntax**

Syntax to retrieve events from named-aggregation is as follows;

```siddhi
from <aggregation>
(on <condition>)?
within <time range>
per <time granularity>
select <attribute name>, <attribute name>, ...
<group by>?
<having>?
<order by>?
<limit>?
```

This is similar to the [Table/Named-Window Select](#tablenamed-window-select), but the input should be a [named-aggregation](#named-aggregation), and the `within <time range>` and `per <time granularity>` should be provided as in [named-aggregation join](#join-aggregation) specifying the time interval for which the aggregate values need to be retrieved, and the the time granularity by which the aggregate values must be grouped and returned respectively.

**Examples**

The on-demand queries used in the examples are performed on a SiddhiApp that contains an aggregation definition similar to the following.

```siddhi
define stream TradeStream (symbol string, price double, volume long, timestamp long);

define aggregation TradeAggregation
  from TradeStream
  select symbol, avg(price) as avgPrice, sum(price) as total
    group by symbol
    aggregate by timestamp every sec ... year;
```

**Example 1**

An on-demand query to retrieve daily aggregations from the `TradeAggregation` within the time range of `"2014-02-15 00:00:00 +05:30", "2014-03-16 00:00:00 +05:30"` (Here, `+05:30` can be omitted if timezone is in GMT).

```siddhi
from TradeAggregation
  within "2014-02-15 00:00:00 +05:30", "2014-03-16 00:00:00 +05:30"
  per "days"
select symbol, total, avgPrice;
```

**Example 2**

An on-demand query to retrieve the hourly aggregations from the `TradeAggregation` for `"FB"` symbol within the day of `2014-02-15`.

```siddhi
from TradeAggregation
  on symbol == "FB"
  within "2014-02-15 **:**:** +05:30"
  per "hours"
select symbol, total, avgPrice;
```

### Insert

On-demand query to insert a new record to a [table](#table)(/[store](#store)), based on the attribute values defined in the `select` clause.

**Syntax**

Syntax to insert events into a table (store) is as follows;

```siddhi
select <attribute name>, <attribute name>, ...
insert into <table>;
```

**Example**

An on-demand query to insert a new record into the table `RoomOccupancyTable` having values for its `roomNo` and `people` attributes as `10` and `2` respectively.

```siddhi
select 10 as roomNo, 2 as people
insert into RoomOccupancyTable
```

Here, the respective SiddhiApp should have a `RoomOccupancyTable` table something similar to the following.

```siddhi
define table RoomOccupancyTable (roomNo int, people int);
```

### Delete

On-demand query to delete records from a [table](#table)(/[store](#store)), based on the specified condition.

**Syntax**

Syntax to delete events from a table (store) is as follows;

```siddhi
<select>?  
delete <table>  
    (on <condition>)?
```

Here, the `on <condition>` specifies the basis on which records are selected to be deleted, and when omitted, all recodes in the table will be removed.

!!! note
    In the `delete` clause, the table attributes must be always referred with the table name as follows:
    `<table name>.<attribute name>`.

**Example**

On-demand queries to delete records in the `RoomTypeTable` table that have `10` as the value for their `roomNo` attribute.

```siddhi
select 10 as roomNumber
delete RoomTypeTable
    on RoomTypeTable.roomNo == roomNumber;
```

```siddhi
delete RoomTypeTable
    on RoomTypeTable.roomNo == 10;
```

Both the above queries result in the same. For the above queries to be performed, the respective SiddhiApp should have a `RoomTypeTable` table defined something similar to the following.

```siddhi
define table RoomTypeTable (roomNo int, type string);
```

### Update

On-demand query to update selected attributes of records from a [table](#table)(/[store](#store)), based on the specified condition.

**Syntax**

Syntax to update events on a table (store) is as follows;

```siddhi
select <attribute name>, <attribute name>, ...?
update <table>
    (set <table>.<attribute name> = (<attribute name>|<expression>), <table>.<attribute name> = (<attribute name>|<expression>), ...)?
    (on <condition>)?
```

The `condition` element specifies the basis on which the events in the table are selected to be updated. **When referring the table attributes in the `update` clause, they must always be referred to with the table name**, and when a condition is not defined, all the events in the table will be updated.

The `set` keyword can be used to update only the selected attributes from the table. Here, for each assignment, the left side should contain the table attribute that is being updated, and the right side can contain a query output attribute, a table attribute, a mathematical operation, or any other. When the `set` clause is not provided, all attributes in the table will be updated based on the query output.

!!! note
    In the `update` clause, the table attributes must be always referred with the table name as follows: `<table name>.<attribute name>`

**Examples**

The on-demand queries used in the examples are performed on a SiddhiApp that contains a table definition similar to the following.

```siddhi
define table RoomOccupancyTable (roomNo int, people int);
```

**Example 1**

An on-demand query to increment the number of `people` by `1` for the `roomNo` `10`, in the `RoomOccupancyTable` table.

```siddhi
update RoomTypeTable
    set RoomTypeTable.people = RoomTypeTable.people + 1
    on RoomTypeTable.roomNo == 10;
```

**Example 2**

An on-demand query to increment the number of `people` by the `arrival` amount for the given `roomNumber`, in the `RoomOccupancyTable` table.

```siddhi
select 10 as roomNumber, 1 as arrival
update RoomTypeTable
    set RoomTypeTable.people = RoomTypeTable.people + arrival
    on RoomTypeTable.roomNo == roomNumber;
```

### Update or Insert

On-demand query to update the events (records) that already exist in the [table](#table)(/[store](#store)) based on a condition, else inserts the event as a new entry to the table.

**Syntax**

Syntax to update or insert events on a table (store) is as follows;

```siddhi
select <attribute name>, <attribute name>, ...
update or insert into <table>
    (set <table>.<attribute name> = (<attribute name>|<expression>), <table>.<attribute name> = (<attribute name>|<expression>), ...)?
    (on <condition>)?
```


The `condition` element specifies the basis on which the events in the table are selected to be updated. **When referring the table attributes in the update clause, they must always be referred with the table name**, and when the condition does not match with any event in the table, then a new event (a record) is inserted into the table. Here, when a condition is not defined, all the events in the table will be updated.

The `set` clause is only used when an update is performed in the update or insert operation. In this case, the `set` keyword can be used to update only the selected attributes from the table. Here, for each assignment, the left side should contain the table attribute that is being updated, and the right side can contain a query output attribute, a table attribute, a mathematical operation, or any other. When the `set` clause is not provided, all attributes in the table will be updated based on the query output.  

!!! note
    In the `update or insert` clause, the table attributes must be always referred with the table name as follows:
    `<table name>.<attribute name>`

**Example**

An on-demand query to update the record with `assignee` `"John"` when there is already and record for `roomNo` `10` in the `RoomAssigneeTable` table, else to insert a new record with values `10`, `"single"` and `"John"` for the attributes `roomNo`, `type`, and `assignee` respectively.

```siddhi
select 10 as roomNo, "single" as type, "John" as assignee
update or insert into RoomAssigneeTable
    set RoomAssigneeTable.assignee = assignee
    on RoomAssigneeTable.roomNo == roomNo;
```

For the above query to be performed, the respective SiddhiApp should have a `RoomAssigneeTable` table defined something similar to the following.

```siddhi
define table RoomAssigneeTable (roomNo int, type string, assignee string);
```

## SiddhiApp Configuration and Monitoring

### Threading and Synchronization

The threading and synchronization behavior of SiddhiApps can be modified by using the `@async` annotation on the Streams. By default, SiddhiApp uses the request threads for all the processing. Here, the request threads follow through the streams and process each query in the order they are defined. By using the `@async` annotation, processing of events can be handed over to a new set of worker threads.

**Purpose**

The `@async` annotation helps to improve the SiddhiApp performance using parallel processing and event chunking, and it can also help to synchronize the execution across multiple operations.

**Syntax**

The syntax for configuring threading in Siddhi is as follows.

```siddhi
@async(buffer.size='<buffer size>', workers='<workers>', batch.size.max='max <batch size>')
define stream <stream name> (<attribute name> <attribute type>, <attribute name> <attribute type>, ... );
```

The following parameters are used to configure the `@async` definition.

|Parameter| Description| Optional | Default Value|
| ------------- |-------------|-------------|-------------|
|`buffer.size`|The size of the event buffer (in power of 2) that holds the events until they are picked by worker threads for processing. | No | - |
|`workers`| The number of worker threads that process the buffered events.| Yes |`1`|
|`batch.size.max`|The maximum number of events that will be fetched from the event buffer to be processed together by a worker thread, at a given time.| Yes| `buffer.size`|

**Parallel processing**

Parallel processing helps to improve the performance by letting multiple threads to process events in parallel. By default, Siddhi does not process events in parallel, unless otherwise, it uses multi-threaded windows, triggers, or the events are sent to Siddhi using multiple input threads either from the sources defined via `@source` annotation or from the applications calling the Siddhi via `InputHander`.

Parallel processing within a SiddhiApp can be explicitly achieved by defining `@async` annotations on the appropriate streams with the number of `workers` being greater than `1`. Here, the whole execution flow beginning from that stream will be executed by multiple workers in parallel.

**Event chunking**

Event chunking helps to improve the performance by processing multiple events to together, especially when the operations are I/O bound. By default, Siddhi does not attempt to chunk/group events together.

Event chunking in a SiddhiApp can be explicitly achieved, by defining `@async` annotations on appropriate streams with `batch.size.max` set to greater than one. Here, the whole execution flow beginning from those streams will execute multiple events together, where each event group will have up to `batch.size.max`  number of events.  

!!! tip "Use a combination of parallel processing, and event chunking to achieve the best performance."
    The optimal values for `buffer.size`, `workers` and `batch.size.max` parameters vary depending on the use case and the environment. Therefore, they can be only identified by testing the setup in a staging environment.

**synchronized execution**

Synchronized execution eliminates possible concurrent updates and race conditions among queries. By default, Siddhi provides synchronization only within its operators and not across queries.

Synchronized execution across multiple queries can be explicitly achieved by defining `@async` annotation on appropriate streams with `workers` set to `1`. Here, the whole execution flow beginning from that stream will be executed synchronously by a single thread.  

!!! warning "Too many async annotations can reduce performance!"
    Having multiple `@async` annotations will result in many threads being used for processing, this increases the context switching overhead, and thereby reducing the overall performance of the SiddhiApp.  Therefore, **use `@async` annotation only when it is necessary**.

### Statistics

The throughput, latency, and memory consumption of SiddhiApps, and their internal operators can be monitored through Siddhi statistics. SiddhiApps can have preconfigured statistics configurations using the `@app:statistics` annotation applied on SiddhiApp level, and they can also be dynamically modified at runtime using the `setStatisticsLevel()` method available on the `SiddhiAppRuntime`.

**Purpose**

Siddhi statistics helps to identify the bottlenecks in the SiddhiApp execution flows, and thereby facilitate to improve SiddhiApp performance by appropriately handling them.

The name of the statistics metrics follow the below format.<br/>
`io.siddhi.SiddhiApps.<SiddhiApp name>.Siddhi.<component type>.<component name>. <metrics type>`.

The following table lists the component types and their supported of metrics types.

|Component Type|Metrics Type|
| ------------- |-------------|
|Stream|throughput<br/>size (The number of buffered events when asynchronous processing is enabled via `@async` annotation.|
|Trigger|throughput (For both trigger and corresponding stream)|
|Source|throughput|
|Sink|throughput|
|Mapper|latency<br/>throughput (For both input and output)<br/>
|Table|memory<br/>throughput (For all operations)<br/>Latency (For all operations)|
|Query|memory<br/>latency|
|Window|throughput (For all operations)<br/>latency (For all operation)|
|Partition|throughput (For all operations)<br/>latency (For all operation)|

**Syntax**

The syntax for defining the statistics for **SiddhiApps running on Java or Python modes** is as follows.

```siddhi
@app:statistics( reporter='<reporter>', interval='<internal>',
                 include='<included metrics for reporting>')
```

The following parameters are used to configure statistics in Java and Python modes.

|Parameter| Description| Default Value|
| ------------- |-------------|-------------|
|`reporter`| The implementation of the statistics reporter. Supported values are:<br/> `console`<br/> `jmx`|`console`|
|`interval`|The statistics reporting time interval (in seconds).|`60`|
|`include`|Specifies the metricizes that should report statistics using a comma-separated list or via wildcards.| `*.*` (All)|

The syntax for defining the statistics for **SiddhiApps running on Local, Docker, or Kubernetes modes** is as follows.

```siddhi
@app:statistics(enable = '<is enable>', include = `'<included metrics for reporting>'`)
```
The following parameters are used to configure statistics in Local, Docker, and Kubernetes modes.

|Parameter| Description| Default Value|
| ------------- |-------------|-------------|
|`enable`|Enables statistics reporting. Supported values are:<br/> `true`, `false`|`false`|
|`include`|Specifies the metricizes that should report statistics using a comma-separated list or via wildcards.| `*.*` (All)|

Here, other statistics configurations are applied commonly to all SiddhiApps, as specified in the [Configuration Guide](../config-guide/#configuring-statistics).

**Example**

A SiddhiApp running on Java, to report statistics every minute, by logging its stats on the console.

```siddhi
@App:name('TestMetrics')
@App:Statistics(reporter = 'console')

define stream TestStream (message string);

@info(name='logQuery')
from TestSream#log("Message:")
insert into TempSream;
```

The statistics reported via console log will be as follows.

<details>
  <summary>Click to view the extract</summary>
11/26/17 8:01:20 PM ============================================================

 -- Gauges ----------------------------------------------------------------------
 io.siddhi.SiddhiApps.TestMetrics.Siddhi.Queries.logQuery.memory
              value = 5760
 io.siddhi.SiddhiApps.TestMetrics.Siddhi.Streams.TestStream.size
              value = 0

 -- Meters ----------------------------------------------------------------------
 io.siddhi.SiddhiApps.TestMetrics.Siddhi.Sources.TestStream.http.throughput
              count = 0
          mean rate = 0.00 events/second
      1-minute rate = 0.00 events/second
      5-minute rate = 0.00 events/second
     15-minute rate = 0.00 events/second
 io.siddhi.SiddhiApps.TestMetrics.Siddhi.Streams.TempSream.throughput
              count = 2
          mean rate = 0.04 events/second
      1-minute rate = 0.03 events/second
      5-minute rate = 0.01 events/second
     15-minute rate = 0.00 events/second
 io.siddhi.SiddhiApps.TestMetrics.Siddhi.Streams.TestStream.throughput
              count = 2
          mean rate = 0.04 events/second
      1-minute rate = 0.03 events/second
      5-minute rate = 0.01 events/second
     15-minute rate = 0.00 events/second

 -- Timers ----------------------------------------------------------------------
 io.siddhi.SiddhiApps.TestMetrics.Siddhi.Queries.logQuery.latency
              count = 2
          mean rate = 0.11 calls/second
      1-minute rate = 0.34 calls/second
      5-minute rate = 0.39 calls/second
     15-minute rate = 0.40 calls/second
                min = 0.61 milliseconds
                max = 1.08 milliseconds
               mean = 0.84 milliseconds
             stddev = 0.23 milliseconds
             median = 0.61 milliseconds
               75% <= 1.08 milliseconds
               95% <= 1.08 milliseconds
               98% <= 1.08 milliseconds
               99% <= 1.08 milliseconds
             99.9% <= 1.08 milliseconds


</details>

### Event Playback

The speed of time within the SiddhiApp can be altered based on the actual event timestamp, using the `@app:playback` SiddhiApp annotation. Here, the event playback updates the current SiddhiApp time to the largest event time seen so far.

**Purpose**

Event playback helps to reprocess previously consumed and stored events in much faster speed, without losing the time-based properties of Siddhi queries, by rapidly replaying the events.

**Syntax**

The syntax for defining event playback is as follows.

```siddhi
@app:playback(idle.time = '<idle time before incrementing timestamp>', increment = '<incremented time interval>')
```

The following parameters are used to configure this annotation.

|Parameter| Description|
| ------------- |-------------|
|`idle.time`|The time duration (in milliseconds), within which when no events arrive, the current SiddhiApp time will be incremented by the value specified under the `increment` parameter.|
|`increment`|The number of seconds, by which, the current SiddhiApp time must be incremented when no events receive during the `idle.time` period.|

Here, both the parameters are optional, and when omitted, the current SiddhiApp time will not be automatically incremented when events do not arrive.

**Example 1**

SiddhiApp to perform playback while incrementing the current SiddhiApp time by `2` seconds when no events arrive for every `100 milliseconds`.

```siddhi
@app:playback(idle.time = '100 millisecond', increment = '2 sec')
```

**Example 2**

SiddhiApp to perform playback while not incrementing the current SiddhiApp time when no events arrive.

```siddhi
@app:playback()
```
